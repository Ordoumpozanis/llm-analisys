// Home Component (page.tsx or Home.tsx)
"use client";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import UserProfileForm from "@/components/forms/user-profile-form";
import ContentForm from "@/components/forms/new-content-form"; // Import ContentForm as NewContentForm
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const saveUserData = useUserStore((state) => state.saveUserData);
  const isUserDataSaved = useUserStore((state) => state.isUserDataSaved);
  const resetUserData = useUserStore((state) => state.resetUserData);
  const setAnalysed = useUserStore((state) => state.setAnalysed);
  const updateUserData = useUserStore((state) => state.updateUserData);
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Chatting with GPT
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-xl lg:text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Your Environmental Impact{" "}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          {isUserDataSaved ? (
            <ContentForm
              formTrigger={
                <Button
                  variant="default"
                  className="border-2 border-green-500 rounded-lg bg-background text-green-500 hover:bg-foreground/70 hover:text-background"
                  size="lg"
                >
                  Continue
                </Button>
              }
              onFinish={(data, submitted) => {
                if (submitted) {
                  // Handle any additional logic after submitting ContentForm

                  // update values in store
                  updateUserData(data);
                  //update store analyse state
                  setAnalysed(false);
                  // Optionally navigate to another page or show a success message
                  router.push("/analyse");
                }
              }}
            />
          ) : (
            <UserProfileForm
              formTrigger={
                <Button
                  variant="default"
                  className="border-2 border-green-500 rounded-lg bg-background text-green-500 hover:bg-foreground/70 hover:text-background"
                  size="lg"
                >
                  Get Started
                </Button>
              }
              onFinish={(data, submitted) => {
                if (submitted) {
                  // Save the user data to the Zustand store
                  saveUserData(data);
                  //update store analyse state
                  setAnalysed(false);
                  // Optionally navigate to another page or show a success message
                  router.push("/analyse");
                }
              }}
            />
          )}

          <motion.h3
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className=" bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-md lg:text-lg font-medium tracking-tight text-transparent "
          >
            The invisible side of AI
          </motion.h3>
        </motion.div>
        {isUserDataSaved && (
          <motion.button
            className="text-green-500 text-sm pt-3"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.8,
              ease: "easeInOut",
            }}
            onClick={() => {
              resetUserData(); // Reset the store
            }}
          >
            Crear my data
          </motion.button>
        )}
      </LampContainer>
    </div>
  );
}
