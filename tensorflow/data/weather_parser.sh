#!/bin/bash
gawk '
BEGIN { 
    FPAT = "([^,]*)|(\"[^\"]+\")"
    count=0
    month=0
    day=0
}
{
  if ($2 != "Measurement Timestamp") { # Do not forget to skip the header line!
    split($2, date, "/")

    if(date[1] != month || date[2] != day) { # new day or month
      month=date[1]
      day=date[2]
      printf("%s/%s/15,%s\n", date[1], date[2], $4)
      ++count
    }
  }
  else printf("%s,%s\n", $2, $3)
}
END {
  #printf("Number of entries: %s\n", count)
}
' ./tensorflow/data/historical-weather.csv > ./tensorflow/data/temperatures.csv