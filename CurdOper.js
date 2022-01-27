const fs = require("fs");
var methodOverride = require("method-override");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const port = 8877;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(bodyParser.json());

// path to our JSON file
const dataPath = "./Details.json";

const getEmpData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};
const saveEmpData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};

//read data
app.get("/", (req, res) => {
  //    let data=res.sendFile('Table.html',{root:'.'})
  let data = fs.readFileSync("Table.html");
  let jsonData = fs.readFileSync(dataPath);
  let arr = JSON.parse(jsonData);
  let empList = [];
  arr.map((val) => empList.push(val));
  let body = "";
  empList.map(
    (val) =>
      (body += `<tr><td>${val.id}</td><td>${val.fname}</td><td>${val.age}</td><td>${val.sal}</td>
           <td><form method="post" action="/${val.id}?_method=DELETE"><button class="btn btn-primary">Delete </button></form><td>
           <form method="get" action="/${val.id}"><button class="btn btn-primary">update</button></td></form></tr>`)
  );
  res.send(`${data} ${body} 
           </tbody>
           </table>
           </body>
           </html>    
           `);
  res.end();
  // res.send(arr)
});

app.get("/submit-data", (req, res) => {
  res.sendFile("Form.html", { root: "." });
});

//create data
app.post("/submit-data", (req, res) => {
  var existData = getEmpData();
  var userData = req.body;
  existData.push(userData);
  console.log(existData);

  saveEmpData(existData);
  res.redirect("/");
  // res.send(`Id is: ${req.body.id}, Name is : ${req.body.fname} , Age is : ${req.body.age} and salary is: ${req.body.sal} `)
});

//update data

//delete data
app.delete("/:id", (req, res) => {
  console.log("Hi");
  const { id } = req.params;
  const employees = getEmpData();
  const index = employees.findIndex((pt) => pt.id == id);

  employees.splice(index, 1);
  saveEmpData(employees);
  res.redirect("/");
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const employees = getEmpData();
  const index = employees.findIndex((pt) => pt.id == id);
  const upd_data = employees[index];
  let data = `<html>
   <head>

   </head>
   <body>
       <h3>Add Details</h3>
       <form method="post" action="/${id}?_method=PUT">
           Id:<input type="text" name="id" placeholder="Enter Id" value=${upd_data.id}/><br/><br/>
        Name:   <input type="text" name="fname" placeholder="Enter Name" value=${upd_data.fname}/><br/><br/>
        Age: <input type="text" name="age" placeholder="Enter age" value=${upd_data.age}/> <br/><br/>
        Salary:<input type="text" name="sal" placeholder="Enter Salary" value=${upd_data.sal}/><br/><br/>
        <input type="submit" value ="submit"/>
       </form>
   </body>
</html>`;
  res.write(data);
});

app.put("/:id", (req, res) => {
  const { id } = req.params;
  const employees = getEmpData();
  const index = employees.findIndex((pt) => pt.id == id);
  employees.splice(index, 1);
  const Empdata = req.body;
  employees.push(Empdata);
  saveEmpData(employees);
  res.redirect("/");
});

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Work on ${port}`);
});
