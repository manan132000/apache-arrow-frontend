import React, { useState, useEffect } from "react";
import axios from "axios";
import * as arrow from "apache-arrow";
import * as aq from "arquero";
import _ from "lodash";

function ArrowDataComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  function extractDataFromTable(table) {
    let extractedData = [];

    // Iterate over each row of the table
    for (const row of table) {
      const rowJson = row.toJSON();
      if (rowJson.origin_lat instanceof Float64Array) {
        rowJson.origin_lat = Array.from(rowJson.origin_lat)[0]; // Assuming only one element in the array
      }
      if (rowJson.origin_lon instanceof Float64Array) {
        rowJson.origin_lon = Array.from(rowJson.origin_lon)[0]; // Assuming only one element in the array
      }

      extractedData.push(rowJson);
    }

    console.log("extracted data:", extractedData);
    return extractedData;
  }

  useEffect(() => {
    const fetchArrowData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getArrowData", {
          responseType: "arraybuffer",
        });

        console.log("reponse ", response);

        const buffer = new Uint8Array(response.data);
        const table = arrow.tableFromIPC(buffer);

        // const groupedTable = table
        //   .groupBy("favoriteFruit") // Group by 'favoriteFruit'
        //   .agg({ count: aq.op.countAll() }) // Aggregate by counting all rows in each group
        //   .execute(); // Execute the aggregation

        // console.log("groupedTable: ", groupedTable);
        console.log("table", table);

        // Assuming arrowTable is your Arrow table and fieldName is the field to group by
        // const columns = table.schema.fields.map((field) => field.name);
        // const data = columns.map((column) =>
        //   table.getColumnByName(column).toArray()
        // );

        // Combine data into objects
        // const combinedData = data[0].map((_, i) =>
        //   Object.fromEntries(columns.map((col, j) => [col, data[j][i]]))
        // );

        // Group data based on fieldName
        // const groupedData = _.groupBy(combinedData, "favoriteFruit");

        // Perform aggregation (e.g., sum) on grouped data
        // const aggregatedData = Object.keys(groupedData).map((key) => {
        //   return {
        //     ["favoriteFruit"]: key,
        //     // Perform aggregation here (e.g., sum of a field)
        //     // Example: sum of 'value' field
        //     sumValue: _.sumBy(groupedData[key], "orange"),
        //   };
        // });

        // Convert aggregated data back to Arrow table
        // const aggregatedTable = arrow.Table.new(aggregatedData);

        // console.log("aggregated table:", aggregatedTable);

        const extractedData = extractDataFromTable(table);
        setData(extractedData);
        // console.log(extractedData);
        // Convert the response data to a Uint8Array
        // const arrowData = new Uint8Array(response.data);

        // // Create an ArrowReader instance
        // const reader = new ArrowReader(arrowData);

        // // Read the Arrow data
        // const table = await reader.read();

        // // Extract data from the table
        // const rows = table.map((row) => ({
        //   name: row.get("name").toString(),
        //   age: row.get("age").toString(),
        // }));

        // setData(rows);
      } catch (error) {
        console.error("Error fetching Arrow data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArrowData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Arrow Data:</h1>
      <table>
        <thead>
          <tr>
            <th>_id</th>
            <th>index</th>
            <th>balance</th>
            <th>age</th>
            <th>fav fruit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row._id}</td>
              <td>{row.index}</td>
              <td>{row.balance}</td>
              <td>{row.age}</td>
              <td>{row.favoriteFruit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArrowDataComponent;
