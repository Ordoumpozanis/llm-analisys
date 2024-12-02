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

const businessCategories = [
  "Education (Schools, Training Centers, Tutors)",
  "Research (Scientific, Academic, Market Research)",
  "Retail/Shop Owner (Brick-and-Mortar, E-commerce)",
  "Office Work (Corporate, Administrative, Professional Services)",
  "Healthcare (Hospitals, Clinics, Wellness Centers)",
  "Marketing and Advertising (Digital Marketing, Creative Agencies)",
  "Agriculture (Farming, Forestry, Livestock)",
  "Hospitality and Food Services (Restaurants, Hotels, Catering)",
  "Construction and Real Estate (Builders, Developers, Realtors)",
  "Technology and IT (Software, Hardware, IT Services)",
  "Manufacturing and Industry (Factories, Production Units)",
  "Transportation and Logistics (Shipping, Delivery Services)",
  "Arts and Entertainment (Media, Film, Music, Events)",
  "Nonprofit and Charity (Social Work, Volunteering Organizations)",
  "Other (Catch-all for unique or unspecified businesses)",
];
import { menuLInks } from "@/setup/menu-links";

const formSchema = z.object({
  consent: z.boolean().optional(),
  age: z
    .number()
    .min(16, { message: "Age must be at least 16." })
    .max(94, { message: "Age must be 94 or below." }),
  chatType: z.enum(["personal", "business", "learning", "testing", "playing"], {
    required_error: "Please select the type of chat.",
  }),
  chatPurpose: z
    .string()
    .min(10, {
      message: "Please provide a reason (at least 10 characters).",
    })
    .refine((val) => /^[a-zA-Z0-9 .]+$/.test(val), {
      message: "Only letters, numbers, spaces, and periods are allowed.",
    }),
  businessCategory: z.string().optional(),
  expertiseLevel: z.enum(["beginner", "medium", "advanced"], {
    required_error: "Please select your expertise level.",
  }),
  educationLevel: z.enum(
    ["none", "high_school", "university", "master", "phd"],
    {
      required_error: "Please select your educational level.",
    }
  ),
});

type FormData = z.infer<typeof formSchema>;

type UserProfileFormProps = {
  formTrigger: React.ReactNode;
  className?: string;
  onFinish?: (data: FormData, submitted: boolean) => void;
};

export default function UserProfileForm({
  formTrigger,
  className,
  onFinish,
}: UserProfileFormProps) {
  const [isOther, setIsOther] = useState(false);
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
      age: 16,
      chatType: "personal",
      chatPurpose: "",
      businessCategory: "",
      expertiseLevel: "beginner",
      educationLevel: "none",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      onFinish?.(data, true);
      // TODO: Implement server submission logic here.
    } catch (error) {
      console.error("Validation Error:", error);
    }
  };

  const chatType = watch("chatType");

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
            <a className="bg-green-500" href={menuLInks[2].href}>
              Security Page
            </a>
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
                  style={
                    {
                      "--switch-thumb-color": field.value ? "black" : "white", // Dynamically change the thumb color
                    } as React.CSSProperties
                  }
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
      title: "Your Age",
      description: "Please enter your age using the input below.",
      content: (
        <div>
          <div className="flex flex-col items-center">
            <Label htmlFor="age">Age:</Label>
            <div className="flex items-center mt-2 gap-4">
              {/* Decrement Button */}
              <button
                type="button"
                onClick={() => {
                  const currentAge = watch("age");
                  const newAge = Math.max(16, (currentAge || 16) - 1);
                  setValue("age", newAge);
                }}
                className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 text-green-700"
              >
                -
              </button>

              {/* Age Input Field */}
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="age"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value)) {
                        field.onChange(value);
                      } else {
                        field.onChange(""); // Clear value if input is invalid
                      }
                    }}
                    onBlur={() => {
                      const currentAge = watch("age");
                      if (currentAge < 16 || currentAge > 100) {
                        setValue(
                          "age",
                          Math.min(Math.max(16, currentAge || 16), 100)
                        );
                      }
                    }}
                    className="w-20 text-center border border-green-500"
                    placeholder="Enter age"
                  />
                )}
              />

              {/* Increment Button */}
              <button
                type="button"
                onClick={() => {
                  const currentAge = watch("age");
                  const newAge = Math.min(100, (currentAge || 16) + 1);
                  setValue("age", newAge);
                }}
                className="px-3 py-1 bg-gray-200 rounded-full text-green-800 hover:bg-gray-300"
              >
                +
              </button>
            </div>
            {errors.age && (
              <p className="text-red-500 text-sm">{errors.age.message}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 2,
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
                  if (value !== "business") {
                    setValue("businessCategory", "");
                  }
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
          {/* Add the textarea for "why you created this chat" */}
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
                  rows={3}
                  draggable={false}
                  className="border-green-500 w-full mt-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z0-9 .]*$/.test(value)) {
                      field.onChange(value); // Update field only if valid
                    }
                  }}
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
    {
      id: 3,
      title: "Business Category",
      description:
        "Please select your business category from the list or specify if applicable.",
      content: chatType === "business" && (
        <div>
          {!isOther ? (
            <ScrollArea className="h-48 border rounded-md mt-2">
              <ul>
                {businessCategories.map((category) => {
                  const [value] = category.split(" (");
                  return (
                    <li
                      key={value}
                      className="p-2 hover:bg-green-500  hover:text-foreground  cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        if (value === "Other") {
                          setIsOther(true);
                        } else {
                          setValue("businessCategory", value);
                          handleNext();
                        }
                      }}
                    >
                      {category}
                      {value === "Other" && (
                        <span className="text-green-500 :hover:text-foreground">
                          ➤
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : (
            <div className="mt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsOther(false)}
                className="px-2 py-1  bg-green-500 hover:bg-background  text-foreground rounded-md border-green-500"
              >
                &#8592; Back
              </button>
              <input
                type="text"
                placeholder="Please specify"
                value={watch("businessCategory") || ""}
                onChange={(e) => setValue("businessCategory", e.target.value)}
                className="flex-1 border rounded-md px-3 py-1 active:border-green-500 "
              />
            </div>
          )}
          {errors.businessCategory && (
            <p className="text-red-500 text-sm">
              {errors.businessCategory.message}
            </p>
          )}
        </div>
      ),
    },

    {
      id: 4,
      title: "Level of Expertise in GPT",
      description: "lease select your level of expertise in using GPT.",
      content: (
        <div>
          <Controller
            name="expertiseLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex flex-col space-y-2 mt-2 border-green-500"
                onValueChange={(value) => {
                  field.onChange(value);
                  trigger("expertiseLevel").then((isValid) => {
                    if (isValid) {
                      handleNext();
                    }
                  });
                }}
              >
                {["beginner", "medium", "advanced"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`expertise-${level}`} />
                    <Label htmlFor={`expertise-${level}`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.expertiseLevel && (
            <p className="text-red-500 text-sm">
              {errors.expertiseLevel.message}
            </p>
          )}
        </div>
      ),
    },

    {
      id: 5,
      title: "Educational Level",
      description: "Please select your highest level of education.",
      content: (
        <div>
          <Controller
            name="educationLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex flex-col space-y-2 mt-2 border-green-500"
                onValueChange={(value) => {
                  field.onChange(value);
                  trigger("educationLevel").then((isValid) => {
                    if (isValid) {
                      handleNext();
                    }
                  });
                }}
              >
                {["none", "high_school", "university", "master", "phd"].map(
                  (level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={`education-${level}`} />
                      <Label htmlFor={`education-${level}`}>
                        {level
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Label>
                    </div>
                  )
                )}
              </RadioGroup>
            )}
          />
          {errors.educationLevel && (
            <p className="text-red-500 text-sm">
              {errors.educationLevel.message}
            </p>
          )}
        </div>
      ),
    },

    {
      id: 6,
      title: "Thank You",
      content: (
        <div>
          <p className="mb-4">
            {` Thank you for your time! Most of these questions won't be repeated
           the next time you use this tool. Enjoy!`}
          </p>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentSlide) {
      case 0:
        fieldsToValidate = ["consent"];
        break;
      case 1:
        fieldsToValidate = ["age"];
        break;
      case 2:
        fieldsToValidate = ["chatType", "chatPurpose"];
        break;
      case 3:
        if (chatType === "business") {
          fieldsToValidate = ["businessCategory"];
        }
        break;
      case 4:
        fieldsToValidate = ["expertiseLevel"];
        break;
      case 5:
        fieldsToValidate = ["educationLevel"];
        break;
      default:
        fieldsToValidate = [];
    }

    const isValid = await trigger(fieldsToValidate);

    // Navigate slides if valid
    if (isValid) {
      if (currentSlide === 2 && chatType !== "business") {
        setCurrentSlide(4); // Skip to "Level of Expertise in GPT"
      } else if (currentSlide === 3 && chatType === "business") {
        setCurrentSlide(4);
      } else {
        setCurrentSlide((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      // If on "Level of Expertise in GPT" and chatType is not "business", skip "Business Category"
      if (currentSlide === 4 && chatType !== "business") {
        setCurrentSlide(2); // Navigate back to "Type of Chat"
      } else {
        setCurrentSlide((prev) => prev - 1);
      }
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
          {currentSlide > 0 &&
            currentSlide < slides.length - 1 &&
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
                  case 1: // Your Age
                    const age = watch("age");
                    return (
                      <>
                        I am{" "}
                        <span className="text-green-500">
                          {age || "Please enter your age."}
                        </span>{" "}
                        years old.
                      </>
                    );
                  case 2: // Type of Chat
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
                  case 3: // Business Category
                    const businessCategory = watch("businessCategory");
                    return (
                      <>
                        I am working in the{" "}
                        <span className="text-green-500">
                          {businessCategory ||
                            "Please select your business category."}
                        </span>{" "}
                        industry.
                      </>
                    );
                  case 4: // Level of Expertise in GPT
                    const expertiseLevel = watch("expertiseLevel");
                    return (
                      <>
                        I am an{" "}
                        <span className="text-green-500">
                          {expertiseLevel ||
                            "Please select your level of expertise."}
                        </span>{" "}
                        user in Chat-GPT.
                      </>
                    );
                  case 5: // Educational Level
                    const educationLevel = watch("educationLevel");
                    return (
                      <>
                        {educationLevel === "none" ? (
                          "I have not finished school."
                        ) : (
                          <>
                            I have a{" "}
                            <span className="text-green-500">
                              {educationLevel ||
                                "Please select your education level."}
                            </span>{" "}
                            degree.
                          </>
                        )}
                      </>
                    );
                  default:
                    return null; // For slides without templates
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
