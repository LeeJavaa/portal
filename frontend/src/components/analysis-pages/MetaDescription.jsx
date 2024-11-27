import Link from "next/link";
import formatDate from "@/utils/dateHandling";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SquareArrowOutUpRight } from "lucide-react";

export default function MetaDescription({ data }) {
  let formatted_played_date = formatDate(data.played_date);

  return (
    <div className="my-8">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium pl-0">Series</TableCell>
            <TableCell className="flex items-center gap-x-4 pr-0">
              {data.series_analysis ? (
                <>
                  <span className="hover:cursor-pointer hover:underline font-medium w-full text-right">
                    <Link href={`/analysis/series/${data.series_analysis}`}>
                      {data.series_analysis_title}
                    </Link>
                  </span>
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </>
              ) : (
                <span className="font-medium w-full text-right">None</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team One</TableCell>
            <TableCell className="text-right pr-0">{data.team_one}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team One Score</TableCell>
            <TableCell className="text-right pr-0">
              {data.team_one_score}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team Two</TableCell>
            <TableCell className="text-right pr-0">{data.team_two}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Team Two Score</TableCell>
            <TableCell className="text-right pr-0">
              {data.team_two_score}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Map</TableCell>
            <TableCell className="text-right pr-0">{data.map}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Game Mode</TableCell>
            <TableCell className="text-right pr-0">{data.game_mode}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium pl-0">Date Played</TableCell>
            <TableCell className="text-right pr-0">
              {formatted_played_date}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
