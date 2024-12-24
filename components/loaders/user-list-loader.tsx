import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface UserListLoaderProps {
  className?: string;
}

export const UserListLoader: React.FC<UserListLoaderProps> = ({
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">
          <Skeleton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Skeleton />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton />
                </TableHead>
                <TableHead>
                  <Skeleton />
                </TableHead>
                <TableHead>
                  <Skeleton />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="mr-2" />
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
