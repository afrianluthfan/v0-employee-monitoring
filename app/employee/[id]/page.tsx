import { supabase } from "@/lib/supabase";
import { Employee } from "@/types/employee";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EmployeeDetails({
  params,
}: {
  params: { id: string };
}) {
  const { data: employee } = await supabase
    .from("employee")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const isEligibleForPromotion = checkEligibilityForPromotion(employee);

  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Dashboard
      </Link>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
              alt={employee.name}
              width={128}
              height={128}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <p className="text-gray-600">ID: {employee.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Employee Information
              </h2>
              <p>
                <strong>Department:</strong> {employee.department}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(employee.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Job Grade:</strong> {employee.job_grade}
              </p>
              <p>
                <strong>Person Grade:</strong> {employee.person_grade}
              </p>
              <p>
                <strong>Performance Rating:</strong>{" "}
                {employee.performance_rating}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Track Record</h2>
              <p className="whitespace-pre-wrap">{employee.track_record}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employee.achievements.map(
              (achievement: string[], index: number) => (
                <Card key={index} className="bg-secondary">
                  <CardContent className="pt-6">
                    <Badge className="mb-2">{`Achievement ${index + 1}`}</Badge>
                    <p>{achievement}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {isEligibleForPromotion && (
        <Card className="bg-green-100 border-green-400">
          <CardContent className="pt-6">
            <p className="text-green-700">
              <strong className="font-bold">Eligible for Promotion!</strong>
              <span className="block sm:inline">
                {" "}
                This employee meets the criteria for promotion consideration.
              </span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
