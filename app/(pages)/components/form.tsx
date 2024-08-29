"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useTransition, Fragment, useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  educationLevel: z.string().min(1, "Please select an education level"),
  subject: z.string().min(1, "Please select a subject"),
  questionCount: z
    .string()
    .min(1, "Must be at least 1 question")
    .max(10, "Maximum 10 questions allowed"),
  language: z.string().min(1, "Please select a language"),
});

export default function TriviaForm() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setLoading] = useState(false);
  const [triviaID, setTriviaID] = useState<number | null>(null);
  const [triviaDetails, setTriviaDetails] = useState<any>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationLevel: "",
      subject: "",
      questionCount: "",
      language: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        setLoading(true);

        // Make a POST request to the API
        const response = await fetch("/api/trivia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();

        if (response.ok) {
          // Add random ID to trivia so it won't replace the previous trivia
          const trivias = JSON.parse(localStorage.getItem("triviaQuestions") || "[]");
          const newTriviaID = Math.random();
          setTriviaID(newTriviaID);
          localStorage.setItem("triviaQuestions", JSON.stringify([...trivias, { id: newTriviaID, trivia: data.triviaQuestions }]));

          setTriviaDetails(data.triviaQuestions);

          toast.success("Trivia generated successfully!");
        } else {
          toast.error(data.message || "Failed to generate trivia.");
        }
      } catch (error) {
        console.error("Error generating trivia:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }

      console.log("Form Values:", values);
    });
  };

  const handleStartTrivia = () => {
    if (triviaID !== null) {
      router.push(`/${triviaID}/trivia`);
    } else {
      toast.error("No trivia ID found. Please try generating trivia again.");
    }
  };

  return (
    <Fragment>
      <h3 className="text-2xl font-bold">Generate Trivia Now!</h3>
      <div className="flex flex-col items-center justify-center w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="w-full space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Education Level Dropdown */}
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Education Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Primary</SelectItem>
                          <SelectItem value="2">Secondary</SelectItem>
                          <SelectItem value="3">High School</SelectItem>
                          <SelectItem value="4">College</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject Dropdown */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="literature">Literature</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Count Input */}
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of Questions"
                        min="1"
                        max="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Language Dropdown */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="indonesian">Indonesian</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Generating Trivia..." : "Generate Trivia"}
            </Button>
          </form>
        </Form>
      </div>

      {triviaID !== null && (
        <Dialog open={triviaID !== null}>
          <DialogContent>
            <DialogTitle>Trivia Generated Successfully</DialogTitle>
            <DialogDescription>
              You have successfully generated trivia questions. Click the button below to start the trivia challenge.
            </DialogDescription>
            <Button className="mt-4" onClick={handleStartTrivia}>
              Start Trivia
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}
