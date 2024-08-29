"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Fragment } from "react";

export default function TriviaForm() {
  return (
    <Fragment>
      <h3 className="text-2xl font-bold">
        Generate Trivia Now!
      </h3>
    <div className="flex flex-col items-center justify-center w-full">
      <form className="w-full">
        <div className="grid md:grid-cols-3 ">
          {/* Education Level Dropdown */}
            <div className="md:pe-3">
            <Select required>
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
          </div>

          {/* Subject Dropdown */}
            <div className="mt-4 md:mt-0 md:pe-3">
            <Select required> 
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
          </div>
        {/* question count */}
        <div className="mt-4 md:mt-0">
          <Input
                required
            type="number"
            name="questionCount"
            id="questionCount"
            placeholder="Number of Questions"
            className="input"
            min="1"
            max="10"
          />
        </div>
        </div>

        {/* Language Dropdown */}
        <div className="mt-4">
            <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="indonesian">Indonesian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button type="submit" className="w-full">
            Generate Trivia
          </Button>
        </div>
      </form>
    </div>
    </Fragment>
  );
}
