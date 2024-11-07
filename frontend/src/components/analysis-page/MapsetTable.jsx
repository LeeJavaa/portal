import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MapsetTable = () => {
  const data = [
    {
      tournament: "Tournament 1",
      series: [
        {
          name: "Series A",
          maps: ["Map 1", "Map 2"],
        },
        {
          name: "Series B",
          maps: ["Map 3", "Map 4"],
        },
      ],
    },
    {
      tournament: "Tournament 2",
      series: [
        {
          name: "Series C",
          maps: ["Map 5", "Map 6", "Map 7"],
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <Table className="border-t border-gray-200">
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="w-1/3">Tournaments</TableHead>
            <TableHead className="w-1/3">Series</TableHead>
            <TableHead className="w-1/3">Maps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tournament, tIndex) => (
            <React.Fragment key={tournament.tournament}>
              {tournament.series.map((series, sIndex) =>
                series.maps.map((map, mIndex) => (
                  <TableRow
                    key={`${tournament.tournament}-${series.name}-${map}`}
                    className={`
                      border-0
                      ${
                        sIndex === tournament.series.length - 1 &&
                        mIndex === series.maps.length - 1 &&
                        tIndex !== data.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }
                    `}
                  >
                    <TableCell className="font-medium">
                      {sIndex === 0 && mIndex === 0
                        ? tournament.tournament
                        : ""}
                    </TableCell>
                    <TableCell>{mIndex === 0 ? series.name : ""}</TableCell>
                    <TableCell>{map}</TableCell>
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
