import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MapsetTable = ({ data }) => {
  const { tournaments } = data.mapset;

  return (
    <div className="w-full">
      <Table className="border-t border-border">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-1/3">Tournaments</TableHead>
            <TableHead className="w-1/3">Series</TableHead>
            <TableHead className="w-1/3">Maps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tournaments.map((tournament) => (
            <React.Fragment key={tournament.id}>
              {tournament.series.map((series, sIndex) =>
                series.maps.map((map, mIndex) => (
                  <TableRow
                    key={`${tournament.id}-${series.id}-${map.id}`}
                    className={`
                      border-0
                      ${
                        sIndex === tournament.series.length - 1 &&
                        mIndex === series.maps.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    `}
                  >
                    <TableCell className="font-medium">
                      {sIndex === 0 && mIndex === 0 ? tournament.title : ""}
                    </TableCell>
                    <TableCell>
                      {mIndex === 0 ? (
                        <Link
                          href={`/analysis/series/${series.id}`}
                          className="hover:underline hover:cursor-pointer"
                        >
                          {series.title}
                        </Link>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/analysis/map/${map.id}`}
                        className="hover:underline hover:cursor-pointer"
                      >
                        {map.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MapsetTable;
