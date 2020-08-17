var tables = document.querySelectorAll(".ogs-table");

for (var a = 0; a < tables.length; a++) {
var headertext = [];

var headers = tables[a].querySelectorAll("th"),
tablebody = tables[a].querySelector("tbody");
for (var i = 0; i < headers.length; i++) {
var current = headers[i];
headertext.push(current.textContent.replace(/\r?\n|\r/, ""));
}
for (var i = 0, row; row = tablebody.rows[i]; i++) {
for (var j = 0, col; col = row.cells[j]; j++) {
col.setAttribute("data-th", headertext[j]);
}
}
}

