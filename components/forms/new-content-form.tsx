"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { menuLInks } from "@/setup/menu-links";

// Define the form schema using Zod
const formSchema = z.object({
  consent: z.boolean().optional(),
  chatType: z.enum(["personal", "business", "learning", "testing", "playing"], {
    required_error: "Please select the type of chat.",
  }),
  chatPurpose: z.string().min(10, {
    message: "Please provide a reason (at least 10 characters).",
  }),
});

// Infer the form data type from the schema
type FormData = z.infer<typeof formSchema>;

// Define the component props
type ContentFormProps = {
  formTrigger: React.ReactNode;
  className?: string;
  onFinish?: (data: FormData, submitted: boolean) => void;
  alreadySubmitted?: boolean;
};

export default function NewContentForm({
  formTrigger,
  className,
  onFinish,
  alreadySubmitted,
}: ContentFormProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      consent: true,
      chatType: "personal",
      chatPurpose: "",
    },
  });

  // Define the slides
  const slides = [
    {
      id: 0,
      title: "Welcome & Consent",
      content: (
        <div>
          <p className="mb-4 text-justify">
            Welcome! This ongoing research aims to evaluate human interaction
            with ChatGPT and the environmental impact we users produce while
            Chatting. By participating, you help us understand user behavior and
            the environmental effects of AI interactions.
          </p>
          <p className="mb-4 text-justify">
            To enable this research, we will read your chat messages with GPT.
            Please do not include any personal or business-sensitive information
            in your conversations, as this data will be accessible to us. If you
            prefer not to share your chat content, please disable the green
            toggle below. This will allow us to collect only behavioral data and
            usage statistics without accessing your messages. You can learn more
            on our{" "}
            <a
              className="bg-green-500 text-white px-1 rounded"
              href={menuLInks[2].href}
            >
              Security Page
            </a>
            .
          </p>
          <div className="flex items-center space-x-4">
            <Label
              htmlFor="consent"
              className={cn(
                watch("consent") ? "text-green-500" : "text-red-500"
              )}
            >
              Allow us to read your chat data:
            </Label>

            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <Switch
                  id="consent"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={cn(
                    "border-2 transition-colors relative",
                    field.value
                      ? "bg-white border-green-500"
                      : "bg-red-500 border-red-500"
                  )}
                  style={{
                    "--switch-thumb-color": field.value ? "black" : "white", // Dynamically change the thumb color
                  }}
                />
              )}
            />

            {/* Dynamic OK or PRIVATE text */}
            <span
              className={cn(
                "ml-2 text-sm font-semibold",
                watch("consent") ? "text-green-500" : "text-red-500"
              )}
            >
              {watch("consent") ? "OK" : "PRIVATE"}
            </span>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-sm">{errors.consent.message}</p>
          )}
        </div>
      ),
    },
    {
      id: 1,
      title: "Type of Chat",
      description:
        "Please select the type of chat that best describes your interaction.",
      content: (
        <div>
          <Controller
            name="chatType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex flex-col space-y-2 mt-2"
                onValueChange={(value) => {
                  field.onChange(value);
                  // If the chat type is not 'business', clear any related fields if applicable
                }}
              >
                {["personal", "business", "learning", "testing", "playing"].map(
                  (type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={`chat-${type}`} />
                      <Label htmlFor={`chat-${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            )}
          />
          {errors.chatType && (
            <p className="text-red-500 text-sm">{errors.chatType.message}</p>
          )}
          {/* Textarea for "Why you created this chat" */}
          <div className="mt-4">
            <Label htmlFor="chatPurpose">
              Could you tell us why you created this chat?
            </Label>
            <Controller
              name="chatPurpose"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="chatPurpose"
                  placeholder="Your reason..."
                  className="w-full mt-2 border-green-500"
                  rows={3}
                  draggable={false}
                />
              )}
            />
            {errors.chatPurpose && (
              <p className="text-red-500 text-sm">
                {errors.chatPurpose.message}
              </p>
            )}
          </div>
        </div>
      ),
    },
  ];

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form Data:", data);
      onFinish?.(data, true);
      // TODO: Implement server submission logic here.
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  // Function to handle advancing to the next slide
  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentSlide) {
      case 0:
        fieldsToValidate = ["consent"];
        break;
      case 1:
        fieldsToValidate = ["chatType", "chatPurpose"];
        break;
      default:
        fieldsToValidate = [];
    }

    const isValid = await trigger(fieldsToValidate);
    console.log(`Validation for slide ${currentSlide}:`, isValid);

    // Navigate slides if valid
    if (isValid) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Function to handle going back to the previous slide
  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Handle TAB key for auto-advance
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      await handleNext();
    } else if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter key
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{formTrigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "w-11/12 lg:max-w-[600px] max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <DialogHeader className="p-5">
          <DialogTitle className="text-xl text-green-500">
            {slides[currentSlide].title}
          </DialogTitle>
          {currentSlide < slides.length - 1 &&
            slides[currentSlide]?.description && (
              <DialogDescription className="text-sm text-muted-foreground">
                {slides[currentSlide].description}
              </DialogDescription>
            )}
        </DialogHeader>

        <Card className="w-full mx-auto">
          <CardHeader>
            <div
              className="text-sm text-muted-foreground mt-2 text-center text-white overflow-y-auto"
              style={{
                display: "-webkit-box", // Enable multi-line truncation
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2, // Limit to 2 lines
                overflow: "hidden", // Hide overflowing content
                maxHeight: "3.5rem", // Approximate height for 2 lines of text
                scrollbarWidth: "thin", // For better scrollbar appearance
              }}
            >
              {(() => {
                switch (currentSlide) {
                  case 0: // Welcome & Consent
                    return null; // No dynamic content for this slide
                  case 1: // Type of Chat
                    const chatType = watch("chatType");
                    const chatPurpose = watch("chatPurpose");
                    return (
                      <>
                        The scope of the chat was{" "}
                        <span className="text-green-500">
                          {chatPurpose || "Please provide the purpose."}
                        </span>{" "}
                        and it was for a{" "}
                        <span className="text-green-500">
                          {chatType || "Please select the type of chat."}
                        </span>{" "}
                        purpose.
                      </>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </CardHeader>

          <CardContent className="relative" onKeyDown={handleKeyDown}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {slides[currentSlide]?.content}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentSlide === 0}
              variant="outline"
            >
              Back
            </Button>
            {currentSlide === slides.length - 1 ? (
              <Button
                type="button" // Ensure the button does not default to type="submit"
                onClick={async () => {
                  if (!isSubmitting) {
                    setIsSubmitting(true);
                    await handleSubmit(onSubmit)();
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
