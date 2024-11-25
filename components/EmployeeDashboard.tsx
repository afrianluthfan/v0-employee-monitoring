"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EmployeeCard from "./EmployeeCard";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"id" | "name" | "job_grade">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    console.log("Fetching employees...");
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("employee").select("*");

      console.log("Supabase response:", { data, error });

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Employees data:", data);
        setEmployees(data);
      } else {
        console.log("No employees data received");
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    }
  });

  const handleSort = (newSortBy: "id" | "name" | "job_grade") => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  function checkEligibilityForPromotion(employee: Employee): boolean {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const startDate = new Date(employee.start_date);

    const hasWorkedThreeYears = startDate <= threeYearsAgo;
    const hasGoodTrackRecord =
      employee.track_record.toLowerCase().includes("good") ||
      employee.track_record.toLowerCase().includes("excellent");
    const hasSignificantAchievements = employee.achievements.length >= 3;
    const hasHighPerformanceRating = employee.performance_rating >= 4;

    return (
      hasWorkedThreeYears &&
      hasGoodTrackRecord &&
      hasSignificantAchievements &&
      hasHighPerformanceRating
    );
  }

  if (loading) return <div className="text-center py-4">Loading...</div>;

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <Button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={() => fetchEmployees()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span>Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value: string) =>
              handleSort(value as "id" | "name" | "job_grade")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="job_grade">Job Grade</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            isEligibleForPromotion={checkEligibilityForPromotion(employee)}
          />
        ))}
      </div>
      {employees.length === 0 && (
        <div className="text-center py-4">No employees found.</div>
      )}
    </div>
  );
}
