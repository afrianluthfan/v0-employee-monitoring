import Image from "next/image";
import Link from "next/link";
import { Employee } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface EmployeeCardProps {
  employee: Employee;
  isEligibleForPromotion: boolean;
}

export default function EmployeeCard({
  employee,
  isEligibleForPromotion,
}: EmployeeCardProps) {
  return (
    <Link href={`/employee/${employee.id}`}>
      <Card
        className={`hover:shadow-lg transition-shadow ${
          isEligibleForPromotion ? "border-green-500 border-2" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.name}`}
              alt={employee.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{employee.name}</h2>
              <p className="text-gray-600">ID: {employee.id}</p>
              <p className="text-gray-600">{employee.department}</p>
              <p className="text-gray-600">Job Grade: {employee.job_grade}</p>
              <p className="text-gray-600">
                Person Grade: {employee.person_grade}
              </p>
              {isEligibleForPromotion && (
                <Badge variant="secondary" className="mt-2">
                  Eligible for Promotion
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
