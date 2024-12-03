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
import { Slider } from "@/components/ui/slider"; // Import Slider from shadcn

// Define the business categories
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

// Define the form schema using Zod
// Define the form schema using Zod
const formSchema = z.object({
  // Slide 3: Reason for Using ChatGPT
  usageReason: z.enum(
    ["Personal", "Business", "Learning", "Testing", "Playing"],
    {
      required_error: "Please select the primary reason for using ChatGPT.",
    }
  ),

  // Slide 4: Business Category (conditionally required)
  businessCategory: z.string().optional(),

  // Slide 5: Daily Usage Hours
  hoursPerDay: z
    .number()
    .min(0, { message: "Minimum value is 0 hours." })
    .max(10, { message: "Maximum value is 10 hours." })
    .default(1),

  // Slide 6: Level of Expertise in GPT
  expertiseLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Please select your level of expertise.",
  }),

  // Slide 7: Educational Level
  educationLevel: z.enum(
    [
      "None",
      "Entry level school",
      "High school",
      "University",
      "Master",
      "PhD",
      "Post Doc",
    ],
    {
      required_error: "Please select your educational level.",
    }
  ),

  // **New Slide 3.5: Your Age**
  age: z
    .number()
    .min(16, { message: "Minimum age is 16." })
    .max(100, { message: "Maximum age is 100." })
    .int({ message: "Age must be an integer." }), // Ensures age is an integer
});

// Infer the form data type from the schema
type FormData = z.infer<typeof formSchema>;

// Define the component props
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
  const [isOther, setIsOther] = useState(false); // State to handle "Other" in Business Category
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

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
      usageReason: "Personal",
      businessCategory: "",
      hoursPerDay: 1,
      expertiseLevel: "Beginner",
      educationLevel: "None",
      age: 16, // **Added Default Age**
    },
  });

  // Watchers for dynamic content
  const usageReason = watch("usageReason");
  const businessCategory = watch("businessCategory");
  const hoursPerDay = watch("hoursPerDay");
  const expertiseLevel = watch("expertiseLevel");
  const educationLevel = watch("educationLevel");
  const age = watch("age");

  //Slides animation
  const fadeInVariantTwo = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2, // Adds delay for each element
        duration: 0.5,
      },
    }),
  };

  //Slides animation
  const fadeInVariantOne = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.2, // Adds delay for each element
        duration: 0.3,
      },
    }),
  };

  // Define the slides
  const slides = [
    {
      id: 0,
      title: "Welcome",
      content: (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.h1
            className="text-2xl font-semibold mb-4 text-center text-green-500"
            custom={1}
            variants={fadeInVariantTwo}
          >
            Welcome !
          </motion.h1>
          <motion.p
            className="text-center text-sm"
            custom={2}
            variants={fadeInVariantTwo}
          >
            {`Before we start, let's answer 5 very short questions.`}
          </motion.p>
        </motion.div>
      ),
    },
    {
      id: 1,
      title: "Scope of Research",
      content: (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.p
            className="mb-4 text-justify"
            custom={1}
            variants={fadeInVariantOne}
          >
            Our research focuses on three main areas:
          </motion.p>
          <ol className="list-decimal list-inside mb-4">
            <motion.li custom={2} variants={fadeInVariantOne}>
              To inform users that AI has an environmental impact and this is an
              interactive way to count our impact.
            </motion.li>
            <motion.li custom={3} variants={fadeInVariantOne}>
              To see how everyday people use ChatGPT in order to study
              human-to-AI interaction in ChatGPT.
            </motion.li>
            <motion.li custom={4} variants={fadeInVariantOne}>
              To estimate the environmental impact.{" "}
            </motion.li>
          </ol>
          <motion.p
            className="mb-4 text-justify"
            custom={5}
            variants={fadeInVariantOne}
          >
            This survey is designed for a general audience, not related to tech
            or AI.
          </motion.p>
        </motion.div>
      ),
    },
    {
      id: 2, // Ensure this ID is unique within the slides array
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
      id: 3,
      title: "Reason for Using ChatGPT",
      description: "Please select the primary reason you use ChatGPT.",
      content: (
        <div>
          <Controller
            name="usageReason"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex flex-col space-y-2 mt-2"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {["Personal", "Business", "Learning", "Testing", "Playing"].map(
                  (reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={`usage-${reason}`} />
                      <Label htmlFor={`usage-${reason}`}>{reason}</Label>
                    </div>
                  )
                )}
              </RadioGroup>
            )}
          />
          {errors.usageReason && (
            <p className="text-red-500 text-sm">{errors.usageReason.message}</p>
          )}
          {/* Removed Dynamic Text from Slide Content */}
        </div>
      ),
    },
    {
      id: 4,
      title: "Business Category",
      description:
        "Please select your business category from the list or specify if applicable.",
      content: usageReason === "Business" && (
        <div>
          {!isOther ? (
            <ScrollArea className="h-48 border rounded-md mt-2">
              <ul>
                {businessCategories.map((category) => {
                  const [value] = category.split(" (");
                  return (
                    <li
                      key={value}
                      className="p-2 hover:bg-green-500 hover:text-foreground cursor-pointer flex justify-between items-center"
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
                        <span className="text-green-500">➤</span>
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
                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md border-green-500"
              >
                &#8592; Back
              </button>
              <input
                type="text"
                placeholder="Please specify"
                value={businessCategory || ""}
                onChange={(e) => setValue("businessCategory", e.target.value)}
                className="flex-1 border rounded-md px-3 py-1 active:border-green-500"
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
      id: 5,
      title: "Daily Usage Hours",
      description: "How many hours per day do you interact with ChatGPT?",
      content: (
        <div className="flex flex-col items-center">
          <Controller
            name="hoursPerDay"
            control={control}
            render={({ field }) => (
              <>
                <Slider
                  {...field}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  max={10}
                  step={1}
                  className="w-[60%]"
                />
                {/* Removed Dynamic Text from Slide Content */}
              </>
            )}
          />
          {errors.hoursPerDay && (
            <p className="text-red-500 text-sm">{errors.hoursPerDay.message}</p>
          )}
        </div>
      ),
    },
    {
      id: 6,
      title: "Level of Expertise in GPT",
      description: "Please select your level of expertise with GPT.",
      content: (
        <div>
          <Controller
            name="expertiseLevel"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="flex flex-col space-y-2 mt-2"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`expertise-${level}`} />
                    <Label htmlFor={`expertise-${level}`}>{level}</Label>
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
          {/* Removed Dynamic Text from Slide Content */}
        </div>
      ),
    },
    {
      id: 7,
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
                className="flex flex-col space-y-2 mt-2"
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                {[
                  "None",
                  "Entry level school",
                  "High school",
                  "University",
                  "Master",
                  "PhD",
                  "Post Doc",
                ].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`education-${level}`} />
                    <Label htmlFor={`education-${level}`}>{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
          {errors.educationLevel && (
            <p className="text-red-500 text-sm">
              {errors.educationLevel.message}
            </p>
          )}
          {/* Removed Dynamic Text from Slide Content */}
        </div>
      ),
    },
    {
      id: 8,
      title: "Thank You!",
      content: (
        <div className="text-center">
          <p className="mb-4">
            Thank you for your time! Your responses are invaluable in helping us
            understand and improve the interaction between humans and AI.
          </p>
          {/* Removed Submit Button from Slide Content */}
        </div>
      ),
    },
  ];

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      onFinish?.(data, true);
      // TODO: Implement server submission logic here.
      console.log("Form Data Submitted:", data);
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  // Function to handle advancing to the next slide
  // Function to handle advancing to the next slide
  const handleNext = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentSlide) {
      case 0:
        // Slide 1: Welcome (no fields to validate)
        break;
      case 1:
        // Slide 2: Scope of Research (no fields to validate)
        break;
      case 2:
        // **New Slide 3: Your Age**
        fieldsToValidate = ["age"];
        break;
      case 3:
        // Slide 4: Reason for Using ChatGPT
        fieldsToValidate = ["usageReason"];
        break;
      case 4:
        // Slide 5: Business Category (conditionally required)
        if (usageReason === "Business") {
          fieldsToValidate = ["businessCategory"];
        }
        break;
      case 5:
        // Slide 6: Daily Usage Hours
        fieldsToValidate = ["hoursPerDay"];
        break;
      case 6:
        // Slide 7: Level of Expertise in GPT
        fieldsToValidate = ["expertiseLevel"];
        break;
      case 7:
        // Slide 8: Educational Level
        fieldsToValidate = ["educationLevel"];
        break;
      default:
        fieldsToValidate = [];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    // **Updated Conditional Navigation**
    if (currentSlide === 2) {
      // After Your Age
      setCurrentSlide(3); // Proceed to Reason for Using ChatGPT Slide
    } else if (currentSlide === 3) {
      // After Reason for Using ChatGPT
      if (usageReason === "Business") {
        setCurrentSlide(4); // Proceed to Business Category Slide
      } else {
        setCurrentSlide(5); // Skip Business Category Slide
      }
    } else if (currentSlide === 4 && usageReason === "Business") {
      // After Business Category
      setCurrentSlide(5); // Proceed to Daily Usage Hours Slide
    } else if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Function to handle going back to the previous slide
  const handleBack = () => {
    if (currentSlide > 0) {
      if (currentSlide === 3 && usageReason !== "Business") {
        setCurrentSlide(1); // Go back to Scope of Research Slide
      } else if (currentSlide === 3 && usageReason === "Business") {
        setCurrentSlide(2); // Go back to Your Age Slide
      } else if (currentSlide === 4) {
        setCurrentSlide(3); // Go back to Reason for Using ChatGPT Slide
      } else if (currentSlide === 5) {
        if (usageReason === "Business") {
          setCurrentSlide(4); // Go back to Business Category Slide
        } else {
          setCurrentSlide(3); // Go back to Reason for Using ChatGPT Slide
        }
      } else if (currentSlide === 2) {
        // Going back from "Your Age" Slide
        setCurrentSlide(1); // Go back to Scope of Research Slide
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
            {currentSlide > 0 && slides[currentSlide].title}
          </DialogTitle>
          {currentSlide >= 0 &&
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
                  case 0: // Slide 1: Welcome
                    return null; // No dynamic content
                  case 1: // Slide 2: Scope of Research
                    return null; // No dynamic content
                  case 2: // **New Slide 3: Your Age**
                    return (
                      <>
                        I am{" "}
                        <span className="text-green-500">
                          {age || "Please enter your age."}
                        </span>{" "}
                        years old.
                      </>
                    );
                  case 3: // Slide 4: Reason for Using ChatGPT
                    return (
                      <>
                        I usually use ChatGPT for{" "}
                        <span className="text-green-500">
                          {usageReason || "Please select your usage reason."}
                        </span>
                        .
                      </>
                    );
                  case 4: // Slide 5: Business Category
                    return (
                      <>
                        My main business scope is{" "}
                        <span className="text-green-500">
                          {businessCategory ||
                            "Please select your business category."}
                        </span>
                        .
                      </>
                    );
                  case 5: // Slide 6: Daily Usage Hours
                    return (
                      <>
                        I use ChatGPT for{" "}
                        <span className="text-green-500">
                          {hoursPerDay || "Please specify"} hours
                        </span>{" "}
                        per day.
                      </>
                    );
                  case 6: // Slide 7: Level of Expertise in GPT
                    return (
                      <>
                        I am an{" "}
                        <span className="text-green-500">
                          {expertiseLevel ||
                            "Please select your expertise level."}
                        </span>{" "}
                        user on ChatGPT.
                      </>
                    );
                  case 7: // Slide 8: Educational Level
                    return educationLevel === "None" ? (
                      "I have not finished any school."
                    ) : (
                      <>
                        I own a{" "}
                        <span className="text-green-500">
                          {educationLevel ||
                            "Please select your education level."}
                        </span>{" "}
                        degree.
                      </>
                    );
                  default:
                    return null; // Slide 9: Thank You (no dynamic content)
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
            {/* Back Button: Shown on all slides except the first slide */}
            <div>
              {currentSlide > 0 && (
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
              )}
            </div>
            {/* Next or Submit Button: Shown on all slides */}
            <div>
              {currentSlide < slides.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
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
              )}
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
