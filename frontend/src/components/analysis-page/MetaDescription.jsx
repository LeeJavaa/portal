import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquareArrowOutUpRight } from "lucide-react";

export default function MetaDescription() {
  return (
    <div className="my-8">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium pl-0">Series</TableCell>
            <TableCell className="flex items-center gap-x-4 pr-0">
              <span className="hover:cursor-pointer hover:underline font-medium w-full text-right">
                OpTic Texas vs NYSL GF, Call of Duty Championships 2024
              </span>
              <SquareArrowOutUpRight className="h-4 w-4" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team One</TableCell>
            <TableCell className="text-right pr-0">OpTic Texas</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team One Score</TableCell>
            <TableCell className="text-right pr-0">250</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team Two</TableCell>
            <TableCell className="text-right pr-0">
              New York Subliners
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team Two Score</TableCell>
            <TableCell className="text-right pr-0">212</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Map</TableCell>
            <TableCell className="text-right pr-0">Karachi</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Game Mode</TableCell>
            <TableCell className="text-right pr-0">Hardpoint</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Date Played</TableCell>
            <TableCell className="text-right pr-0">21 July 2024, 6pm</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
