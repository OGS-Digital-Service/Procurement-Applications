var pageNumber = 0;
var currentResizeColumnIndex = -1;
var columnXpixelAtResizeStart = -1;
var resizingColumn = null;
var resizingDiv = null;
var resizingGrid = false;
var myImg = null;
var myImg2 = null;
var XpixelAtGridResizeStart = -1;
var XpixelAtGridResize = -1;
var WidthAtGridResizeStart = -1;
var dateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
var dateFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
var itemList = [];
var filtereditemList = [];

function stripHtml(htmlText) {
    var div = document.createElement("div");
    div.innerHTML = htmlText;
    var plainText = div.textContent || div.innerText || "";
    return plainText.trim();
}

function parseIOSDate(str) {
    if (str[str.length - 1] === 'Z')
        return parseISOUTC(str);
    return parseISOLocal(str);
}

function parseISOUTC(s) {
    return new Date(s);
}

function parseISOLocal(s) {
    var b = s.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

function isValidDate(d) {
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function parseDate3(st) {
    if (st === null || st.length !== 10)
        return new Date(1000, 1, 1);
    var y = parseInt(st.substring(6, 10));
    var m = parseInt(st.substring(0, 2));
    var d = parseInt(st.substring(3, 5));
    var ddd = new Date(y, m, d);
    return ddd;
}

function gotoPage(pageNum) {
    pageNumber = pageNum;
    renderGrid();
}

function changePageSize(comp) {
    pageSize = parseInt(comp.value);
    pageNumber = 0;
    renderGrid();
    storePageSize();
}

function startColumnResize(e, columnIndex, imgComp) {
    var evn = e || window.event;
    evn.preventDefault();
    resizingColumn = document.getElementById('col' + columnIndex);
    resizingDiv = document.getElementById('div' + columnIndex);
    currentResizeColumnIndex = columnIndex;
    var X = evn.clientX || evn.pageX;
    var Y = evn.clientY || evn.pageY;
    columnXpixelAtResizeStart = X;
    myImg = document.getElementById("myImg");
    myImg.style.top = (imgComp.getBoundingClientRect().top + window.scrollY) + "px";
    myImg.style.left = (imgComp.getBoundingClientRect().left + window.scrollX) + "px";
    imgComp.style.visibility = 'hidden';
    myImg.style.visibility = 'visible';
}

function stopColumnResize(e) {
    if (currentResizeColumnIndex == -1)
        return;
    var evn = e || window.event;
    evn.preventDefault();
    columns[currentResizeColumnIndex].width = columns[currentResizeColumnIndex].modifiedWidth;
    currentResizeColumnIndex = -1;
    resizingColumn = null;
    resizingDiv = null;
    myImg.style.visibility = 'hidden';
    renderHeader();
    renderGrid();
    storeWidths();
}

function resizeColumn(e) {
    if (currentResizeColumnIndex > -1 && resizingColumn != null) {
        var evn = e || window.event;
        evn.preventDefault();
        var X = evn.clientX || evn.pageX;
        var newWidth = columns[currentResizeColumnIndex].width + X - columnXpixelAtResizeStart;
        if (newWidth > 5) {
            myImg.style.left = X + "px";
            columns[currentResizeColumnIndex].modifiedWidth = columns[currentResizeColumnIndex].width + X - columnXpixelAtResizeStart;
            resizingColumn.style.width = (columns[currentResizeColumnIndex].modifiedWidth - 1) + "px";
            resizingColumn.style.minWidth = (columns[currentResizeColumnIndex].modifiedWidth - 1) + "px";
            var divWidth = (columns[currentResizeColumnIndex].modifiedWidth - (columns[currentResizeColumnIndex].sortable ? 15 : 5));
            if (divWidth < 0)
                divWidth = 0;
            resizingDiv.style.width = divWidth + "px";
        }
    }
}

function startGridWidthChange(e) {
    var evn = e || window.event;
    evn.preventDefault();
    var X = evn.clientX || evn.pageX;
    XpixelAtGridResizeStart = X;
    myImg2 = document.getElementById("myImg2");
    myImg2.style.top = (evn.target.getBoundingClientRect().top + window.scrollY) + "px";
    myImg2.style.left = (evn.target.getBoundingClientRect().left + window.scrollX) + "px";
    myImg2.style.visibility = 'visible';
    resizingGrid = true;
    WidthAtGridResizeStart = maxWidth;
}

function stopGridWidthChange(e) {
    if (resizingGrid == false)
        return;

    var evn = e || window.event;
    evn.preventDefault();
    maxWidth = WidthAtGridResizeStart + (XpixelAtGridResize - XpixelAtGridResizeStart);
    if (maxWidth < 600)
        maxWidth = 600;
    XpixelAtGridResizeStart = -1;
    XpixelAtGridResize = -1;
    resizingGrid = false;
    myImg2.style.visibility = 'hidden';
    resizeGrid();
    setGridHeight();
    storeWidths();
}

function changeGridWidth(e) {
    if (resizingGrid) {
        var evn = e || window.event;
        evn.preventDefault();
        var X = evn.clientX || evn.pageX;
        myImg2.style.left = X + "px";
        XpixelAtGridResize = X;
    }
}

//function storeWidths() {
//    try {
//        var t = [];
//        t.push('gridColumnWidths=');
//        for (var i = 0; i < columns.length; i++) {
//            t.push(columns[i].width);
//            t.push(',');
//        }
//        t.push(maxWidth);
//        t.push(';expires=');
//        t.push(new Date('2019/12/31').toGMTString());
//        document.cookie = t.join('');
//    }
//    catch (err) {
//        alert(err);
//    }
//}

//function storePageSize() {
//    try {
//        var t = [];
//        t.push('gridPageSize=');
//        t.push(pageSize);
//        t.push(';expires=');
//        t.push(new Date('2019/12/31').toGMTString());
//        document.cookie = t.join('');
//    }
//    catch (err) { }
//}

//function readWidths() {
//    try {
//        var widthsFound = false;
//        var decodedCookie = decodeURIComponent(document.cookie);
//        var ca = decodedCookie.split(';');
//        for (var i = 0; i < ca.length && widthsFound == false; i++) {
//            var c = ca[i];
//            while (c.charAt(0) == ' ') {
//                c = c.substring(1);
//            }
//            if (c.indexOf('gridColumnWidths=') == 0) {
//                widthsFound = true;
//                var widthsString = c.substring(17, c.length);
//                var widthArray = widthsString.split(',');
//                for (var i = 0; i < widthArray.length - 1; i++) {
//                    if (i < columns.length && columns[i].resizeable) {
//                        if (widthArray[i] != '' && widthArray[i].length > 0 && isNaN(widthArray[i]) == false) {
//                            columns[i].width = parseInt(widthArray[i]);
//                        }
//                    }
//                }
//                if (widthArray[i] != '' && widthArray[i].length > 0 && isNaN(widthArray[i]) == false) {
//                    maxWidth = parseInt(widthArray[i]);
//                    if (maxWidth < 50)
//                        maxWidth = 500;
//                }
//            }
//        }
//        if (widthsFound == false) {
//            var gridWidth = 30;
//            var windowWidth = parseInt(window.innerWidth);
//            for (var i = 0; i < columns.length; i++) {
//                gridWidth += columns[i].width;
//            }
//            if (gridWidth < windowWidth) {
//                var ratio = windowWidth / gridWidth;
//                for (var i = 0; i < columns.length; i++) {
//                    columns[i].width = Math.floor(columns[i].width * ratio);
//                }
//                maxWidth = windowWidth;
//            }
//            storeWidths();
//        }
//    }
//    catch (err) { }
//}

function readPageSize() {
    try {
        var pageSizeFound = false;
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length && pageSizeFound == false; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf('gridPageSize=') == 0) {
                pageSizeFound = true;
                var pageSizeString = c.substring(13, c.length);
                pageSize = parseInt(pageSizeString);
            }
        }
    }
    catch (err) { }
}

function setGridHeight() {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById("gridContainer").style.minHeight = (h - 500) + "px";
}

function resizeGrid() {
    var w = parseInt(window.innerWidth);
    if (w < maxWidth) {
        setGridWidth(w);
    }
    else {
        setGridWidth(maxWidth);
    }
}

function setGridWidth(w) {
    console.log("w: " + w);
    document.getElementById('mainPanel').style.width = (w - 20) + 'px';
    document.getElementById('headerRow1').style.width = (w - 20) + 'px';
    document.getElementById('headerRow2').style.width = (w - 50) + 'px';
    document.getElementById('headerContainer').style.width = (w - 55) + 'px';
    document.getElementById('gridContainer').style.width = (w - 30) + 'px';
}

function formatDateTime(date) {
    if (date.getTime() == 0)
        return '';
    return date.toLocaleDateString(undefined, dateTimeFormatOptions);
}

function formatDate2(date) {
    if (date.getTime() == 0)
        return '';
    return date.toLocaleDateString(undefined, dateFormatOptions);
}

function htmlEscape(str) {
    if (str == null)
        return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/,/g, '&comma;');
}

function sortByColumn(columnName) {
    if (itemList == null || itemList.length == 0)
        return;
    if (sortColumn == columnName) {
        sortAsc = !sortAsc;
    }
    else {
        sortColumn = columnName;
        sortAsc = true;
    }
    showProgressPanel("Please wait while sorting ...");
    setTimeout('sortGrid();', 50);
}

function sortGrid() {
    function sortFunction1(a, b) {
        if (a[sortColumn].SortData === b[sortColumn].SortData) {
            return 0;
        }
        else {
            return (a[sortColumn].SortData < b[sortColumn].SortData) ? -1 : 1;
        }
    }
    function sortFunction2(a, b) {
        if (a[sortColumn].SortData === b[sortColumn].SortData) {
            return 0;
        }
        else {
            return (a[sortColumn].SortData > b[sortColumn].SortData) ? -1 : 1;
        }
    }
    if (sortAsc) {
        itemList = itemList.sort(sortFunction1);
    }
    else {
        itemList = itemList.sort(sortFunction2);
    }
    renderGrid();
}

function containerScrolled(comp) {
    document.getElementById("headerContainer").scrollLeft = comp.scrollLeft;
}

function openFilter(columnIndex, comp) {
    var divComp = document.getElementById('filterPanel_' + columns[columnIndex].name);
    if (divComp.style.display == 'none') {

        if (columns[columnIndex].filterType == 'uniqueoptions') {

            for (var j = 0; j < itemList.length; j++) {
                itemList[j].filteredOut2 = false;
            }

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].filterActive && i != columnIndex) {
                    for (var j = 0; j < itemList.length; j++) {
                        if (itemList[j].filteredOut2 == false) {
                            if (columns[i].filterType == 'uniqueoptions') {
                                var lineValue = itemList[j][columns[i].name].Value;
                                for (var k = 0; k < columns[i].filterOptions.length; k++) {
                                    if (columns[i].filterOptions[k].checked == false && lineValue == columns[i].filterOptions[k].text) {
                                        itemList[j].filteredOut2 = true;
                                    }
                                }
                            }
                            else if (columns[i].filterType == 'searchText') {
                                var lineValue = itemList[j][columns[i].name].Value;
                                if (lineValue.indexOf(columns[i].filterText) < 0) {
                                    itemList[j].filteredOut2 = true;
                                }
                            }

                            else if (columns[i].filterType == 'daterange') {
                                if (itemList[j][columns[i].name].Value != null) {
                                    var lineValue = itemList[j][columns[i].name].Value.withoutTime().getTime();
                                    if (columns[i].filterDateOption == 0) {
                                        if (columns[i].filterStartDate != null && lineValue != columns[i].filterStartDate.getTime())
                                            itemList[j].filteredOut2 = true;
                                    }
                                    if (columns[i].filterDateOption == 1) {
                                        if (columns[i].filterStartDate != null && lineValue > columns[i].filterStartDate.getTime())
                                            itemList[j].filteredOut2 = true;
                                    }
                                    else if (columns[i].filterDateOption == 2) {
                                        if (columns[i].filterEndDate != null && lineValue < columns[i].filterEndDate.getTime())
                                            itemList[j].filteredOut2 = true;
                                    }
                                    else if (columns[i].filterDateOption == 3) {
                                        if (lineValue < columns[i].filterStartDate || lineValue > columns[i].filterEndDate.getTime())
                                            itemList[j].filteredOut2 = true;
                                    }
                                }
                                else {
                                    itemList[j].filteredOut2 = true;
                                }
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < columns.length; i++) {
                if (columns[i].filterType == 'uniqueoptions') {
                    for (var j = 0; j < columns[i].filterOptions.length; j++) {
                        columns[i].filterOptions[j].filteredCount = 0;
                    }
                    for (var j = 0; j < itemList.length; j++) {
                        if (itemList[j].filteredOut2 == false) {
                            var lineValue = itemList[j][columns[i].name].Value;
                            for (var k = 0; k < columns[i].filterOptions.length; k++) {
                                if (lineValue == columns[i].filterOptions[k].text) {
                                    columns[i].filterOptions[k].filteredCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        var html = [];
        html.push('<span style="font-weight:bold;font-size:12px">');
        html.push(columns[columnIndex].title);
        html.push(' Filter</span><img src="/resources/close.png" id="cb');
        html.push(columns[columnIndex].name);
        html.push('" style="float:right;margin-right:7px" onclick="hideFilter(');
        html.push(columnIndex);
        html.push(')"><div style="max-height:250px;overflow-y:auto;margin-right:8px; margin-bottom: 10px">');
        if (columns[columnIndex].filterType == 'uniqueoptions') {
            var afterFilterCount = 0;
            for (var j = 0; j < columns[columnIndex].filterOptions.length; j++) {
                if (columns[columnIndex].filterOptions[j].filteredCount > 0)
                    afterFilterCount++;
            }
            if (columns[columnIndex].filterOptions.length > 0) {
                html.push('<input type="checkbox" id="fcba_');
                html.push(columns[columnIndex].name);
                html.push('" style="margin:0" ');
                html.push(columns[columnIndex].filterAllOptionsChecked ? 'checked="checked"' : '');
                html.push(' onchange="checkAllFilterOptions(');
                html.push(columnIndex);
                html.push(', this)">&nbsp;<label style="font-size:12px;display:inline" for="fcba_');
                html.push(columns[columnIndex].name);
                html.push('">All (');
                html.push(columns[columnIndex].filterOptions.length);
                html.push(' options');
                if (columns[columnIndex].filterOptions.length != afterFilterCount) {
                    html.push(', after filters ');
                    html.push(afterFilterCount);
                }
                html.push(')</label><br/>');
                for (var j = 0; j < columns[columnIndex].filterOptions.length; j++) {
                    if (columns[columnIndex].filterOptions[j].filteredCount > 0) {
                        html.push('<input type="checkbox" id="fcb_');
                        html.push(columns[columnIndex].name);
                        html.push('_');
                        html.push(j);
                        html.push('"');
                        if (columns[columnIndex].filterOptions[j].checked)
                            html.push(' checked="checked"');
                        html.push(' style="margin:0" onchange="checkFilterOption(');
                        html.push(columnIndex);
                        html.push(',');
                        html.push(j);
                        html.push(', this)">&nbsp;<label style="font-size:12px;display:inline" for="fcb_');
                        html.push(columns[columnIndex].name);
                        html.push('_');
                        html.push(j);
                        html.push('">');
                        html.push(columns[columnIndex].filterOptions[j].text == null || columns[columnIndex].filterOptions[j].text.length == 0 ? '[Empty]' : columns[columnIndex].filterOptions[j].text);
                        html.push(' (');
                        html.push(columns[columnIndex].filterOptions[j].count);
                        if (columns[columnIndex].filterOptions[j].count != columns[columnIndex].filterOptions[j].filteredCount) {
                            html.push(', ');
                            html.push(columns[columnIndex].filterOptions[j].filteredCount);
                        }
                        html.push(')</label><br/>');
                    }
                }
                if (columns[columnIndex].filterOptions.length != afterFilterCount)
                    html.push('<hr/>');
                for (var j = 0; j < columns[columnIndex].filterOptions.length; j++) {
                    if (columns[columnIndex].filterOptions[j].filteredCount == 0) {
                        html.push('<input type="checkbox" id="fcb_');
                        html.push(columns[columnIndex].name);
                        html.push('_');
                        html.push(j);
                        html.push('"');
                        if (columns[columnIndex].filterOptions[j].checked)
                            html.push(' checked="checked"');
                        html.push(' style="margin:0" onchange="checkFilterOption(');
                        html.push(columnIndex);
                        html.push(',');
                        html.push(j);
                        html.push(', this)">&nbsp;<label style="font-size:12px;display:inline" for="fcb_');
                        html.push(columns[columnIndex].name);
                        html.push('_');
                        html.push(j);
                        html.push('">');
                        html.push(columns[columnIndex].filterOptions[j].text == null || columns[columnIndex].filterOptions[j].text.length == 0 ? '[Empty]' : columns[columnIndex].filterOptions[j].text);
                        html.push(' (');
                        html.push(columns[columnIndex].filterOptions[j].count);
                        if (columns[columnIndex].filterOptions[j].count != columns[columnIndex].filterOptions[j].filteredCount) {
                            html.push(', ');
                            html.push(columns[columnIndex].filterOptions[j].filteredCount);
                        }
                        html.push(')</label><br/>');
                    }
                }
            }
        }
        else if (columns[columnIndex].filterType == 'searchText') {
            html.push('<span style="font-size:12px">Contains:</span>&nbsp;<input type="text" id="ft_');
            html.push(columns[columnIndex].name);
            html.push('" style="width: 180px; font-size: 12px;" value="');
            html.push(columns[columnIndex].filterText);
            html.push('" onkeydown="filterTextChanged(');
            html.push(columnIndex);
            html.push(', this)" onchange="filterTextChanged(');
            html.push(columnIndex);
            html.push(', this)">');
        }
        else if (columns[columnIndex].filterType == 'daterange') {
            html.push('<div id="dfd_');
            html.push(columnIndex);
            html.push('">');
            html.push(renderDateFilter(columnIndex));
            html.push('</div>');
        }
        html.push('</div><input type="button" id="af_');
        html.push(columns[columnIndex].name);
        html.push('" value="Apply Filter" style="font-size: 12px" onclick="applyFilter(');
        html.push(columnIndex);
        html.push(')"');
        if ((columns[columnIndex].filterType == 'uniqueoptions' && columns[columnIndex].filterAllOptionsChecked) ||
            (columns[columnIndex].filterType == 'searchText' && columns[columnIndex].filterText.length == 0))
            html.push(' disabled="disabled"');
        html.push('>');
        html.push('&nbsp;&nbsp;&nbsp;<input type="button" id="rf_');
        html.push(columns[columnIndex].name);
        html.push('" value="Remove Filter" style="font-size: 12px;');
        if (columns[columnIndex].filterActive == false)
            html.push('visibility:hidden');
        html.push('" onclick="removeFilter(');
        html.push(columnIndex);
        html.push(')">');
        divComp.innerHTML = html.join('');

        var boundingComp = comp.getBoundingClientRect();
        divComp.style.top = (boundingComp.top + window.scrollY + 20) + "px";
        if (columnIndex < 7)
            divComp.style.left = (boundingComp.left + window.scrollX) + "px";
        else
            divComp.style.left = (boundingComp.left + window.scrollX - 250) + "px";

        divComp.style.display = 'inline';

        if (columns[columnIndex].filterType == 'uniqueoptions') {
            for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
                columns[columnIndex].filterOptions[i].checkedBackup = columns[columnIndex].filterOptions[i].checked;
            }
            columns[columnIndex].filterAllOptionsCheckedBackup = columns[columnIndex].filterAllOptionsChecked;
        }
    }
    else {
        divComp.style.display = 'none';
        for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
            columns[columnIndex].filterOptions[i].checked = columns[columnIndex].filterOptions[i].checkedBackup;
        }
        columns[columnIndex].filterAllOptionsChecked = columns[columnIndex].filterAllOptionsCheckedBackup;
    }
}

function hideFilter(columnIndex) {
    var divComp = document.getElementById('filterPanel_' + columns[columnIndex].name);
    divComp.style.display = 'none';
    for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
        columns[columnIndex].filterOptions[i].checked = columns[columnIndex].filterOptions[i].checkedBackup;
    }
    columns[columnIndex].filterAllOptionsChecked = columns[columnIndex].filterAllOptionsCheckedBackup;
}

function applyFilter(columnIndex) {

    if (columns[columnIndex].filterType == 'uniqueoptions') {
        if (columns[columnIndex].filterAllOptionsChecked == false) {
            columns[columnIndex].filterActive = true;
        }
    }
    else if (columns[columnIndex].filterType == 'searchText') {
        var textComp = document.getElementById('ft_' + columns[columnIndex].name);
        if (textComp == null) {
            alert('Error: Cannot find component: ' + 'ft_' + columns[columnIndex].name);
            return;
        }
        var filterText = textComp.value;
        if (filterText == null || filterText.length == 0) {
            return;
        }
        columns[columnIndex].filterActive = true;
        columns[columnIndex].filterText = filterText;
    }
    else if (columns[columnIndex].filterType == 'daterange') {
        if ((columns[columnIndex].filterDateOption == 0 ||
            columns[columnIndex].filterDateOption == 1 ||
            columns[columnIndex].filterDateOption == 2) && columns[columnIndex].filterStartDate == null) {
            alert('Error: Date not provided');
            return;
        }
        if ((columns[columnIndex].filterDateOption == 2 ||
            columns[columnIndex].filterDateOption == 3) && columns[columnIndex].filterEndDate == null) {
            alert('Error: Date not provided');
            return;
        }
        columns[columnIndex].filterActive = true;
    }
    var divComp = document.getElementById('filterPanel_' + columns[columnIndex].name);
    divComp.style.display = 'none';
    showProgressPanel('Please wait while applying the filter ...');
    setTimeout('renderHeader()', 20);
    setTimeout('applyFiltersToitemList()', 50);
}

function removeFilter(columnIndex) {
    var divComp = document.getElementById('filterPanel_' + columns[columnIndex].name);
    divComp.style.display = 'none';
    columns[columnIndex].filterActive = false;

    var removeButton = document.getElementById("rf_" + columns[columnIndex].name);
    if (removeButton != null)
        removeButton.style.visibility = columns[columnIndex].filterActive ? 'visible' : 'hidden';
    var filterImage = document.getElementById("fi_" + columns[columnIndex].name);
    if (filterImage != null)
        filterImage.src = '/resources/' + (columns[columnIndex].filterActive ? 'a' : 'd') + 'Filter.gif';

    for (var i = 0; i < columns[columnIndex].filterOptions.length; i++)
        columns[columnIndex].filterOptions[i].checked = true;
    columns[columnIndex].filterAllOptionsChecked = true;
    showProgressPanel('Please wait while removing the filter ...');
    setTimeout('applyFiltersToitemList()', 50);
}

function checkAllFilterOptions(columnIndex, comp) {
    var columnName = columns[columnIndex].name;
    var newValue = comp.checked;
    for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
        columns[columnIndex].filterOptions[i].checked = newValue;
        var checkComp = document.getElementById('fcb_' + columnName + '_' + i);
        if (checkComp != null) {
            checkComp.checked = newValue;
        }
    }
    var applyButton = document.getElementById('af_' + columns[columnIndex].name);
    if (applyButton != null)
        applyButton.disabled = true;
}

function checkFilterOption(columnIndex, optionIndex, comp) {
    columns[columnIndex].filterOptions[optionIndex].checked = comp.checked;
    var applyButton = document.getElementById('af_' + columns[columnIndex].name);
    if (comp.checked == false) {
        columns[columnIndex].filterAllOptionsChecked = false;
        var checkComp = document.getElementById('fcba_' + columns[columnIndex].name);
        if (checkComp != null) {
            checkComp.checked = false;
        }
        var noneChecked = true;
        for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
            noneChecked = noneChecked && columns[columnIndex].filterOptions[i].checked == false;
        }
        if (applyButton != null)
            applyButton.disabled = noneChecked;
    }
    else {
        var allChecked = true;
        for (var i = 0; i < columns[columnIndex].filterOptions.length; i++) {
            allChecked = allChecked && columns[columnIndex].filterOptions[i].checked;
        }
        columns[columnIndex].filterAllOptionsChecked = allChecked;
        var checkComp = document.getElementById('fcba_' + columns[columnIndex].name);
        if (checkComp != null) {
            checkComp.checked = allChecked;
        }
        if (applyButton != null)
            applyButton.disabled = allChecked;
    }
}

function filterTextChanged(columnIndex, comp) {
    var applyButton = document.getElementById('af_' + columns[columnIndex].name);
    if (applyButton != null)
        applyButton.disabled = comp.value.length == 0;
}

function applyFiltersToitemList() {

    pageNumber = 0;
    for (var j = 0; j < itemList.length; j++) {
        itemList[j].filteredOut = false;
    }

    for (var i = 0; i < columns.length; i++) {
        if (columns[i].filterActive) {
            for (var j = 0; j < itemList.length; j++) {
                if (itemList[j].filteredOut == false) {
                    if (columns[i].filterType == 'searchText') {
                        var fieldValue = itemList[j][columns[i].name].Value.toLowerCase();
                        if (fieldValue.indexOf(columns[i].filterText.toLowerCase()) < 0) {
                            itemList[j].filteredOut = true;
                        }
                    }
                    else if (columns[i].filterType == 'uniqueoptions') {
                        var lineValue = itemList[j][columns[i].name].Value;
                        for (var k = 0; k < columns[i].filterOptions.length; k++) {
                            if (columns[i].filterOptions[k].checked == false && lineValue == columns[i].filterOptions[k].text) {
                                itemList[j].filteredOut = true;
                            }
                        }
                    }
                    else if (columns[i].filterType == 'daterange') {
                        if (itemList[j][columns[i].name].Value != null) {
                            var lineValue = itemList[j][columns[i].name].Value.withoutTime().getTime();
                            if (columns[i].filterDateOption == 0) {
                                if (columns[i].filterStartDate != null && lineValue != columns[i].filterStartDate.getTime())
                                    itemList[j].filteredOut = true;
                            }
                            if (columns[i].filterDateOption == 1) {
                                if (columns[i].filterStartDate != null && lineValue > columns[i].filterStartDate.getTime())
                                    itemList[j].filteredOut = true;
                            }
                            else if (columns[i].filterDateOption == 2) {
                                if (columns[i].filterEndDate != null && lineValue < columns[i].filterEndDate.getTime())
                                    itemList[j].filteredOut = true;
                            }
                            else if (columns[i].filterDateOption == 3) {
                                if (lineValue < columns[i].filterStartDate || lineValue > columns[i].filterEndDate.getTime())
                                    itemList[j].filteredOut = true;
                            }
                        }
                        else {
                            itemList[j].filteredOut = true;
                        }
                    }
                }
            }
        }
    }

    renderGrid();
    hideProgressPanel();
}

function refreshData() {
    loaditemList();
}

function renderDateFilter(columnIndex) {
    var html = [];

    if (columns[columnIndex].filterDateOption == 0) {
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size: 12px" checked="checked" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 0, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px;display:inline">On Date:</label>');
        html.push('<input type="date" id="fd0_');
        html.push(columns[columnIndex].name);
        html.push('" style="width: 120px; font-size: 12px;" value="');
        html.push(formatDate(columns[columnIndex].filterStartDate));
        html.push('" onkeydown="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)" onchange="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)"><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 1, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px;display:inline">On or Before Date</label><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px;display:inline">On or After Date</label><br/>');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 3, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px;display:inline">Between Dates</label><br/>');
    }
    else if (columns[columnIndex].filterDateOption == 1) {
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 0, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px;display:inline">On Date</label><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px" checked="checked" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 1, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px;display:inline">On or Before Date:</label>');
        html.push('<input type="date" id="fd1_');
        html.push(columns[columnIndex].name);
        html.push('" style="width: 120px; font-size: 12px;" value="');
        html.push(formatDate(columns[columnIndex].filterStartDate));
        html.push('" onkeydown="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)" onchange="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)"><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px;display:inline">On or After Date</label><br/>');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 3, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px;display:inline">Between Dates</label><br/>');
    }
    else if (columns[columnIndex].filterDateOption == 2) {
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 0, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px;display:inline">On Date</label><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 1, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px;display:inline">On or Before Date</label><br/>');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px" checked="checked" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px;display:inline">On or After Date:</label>');
        html.push('<input type="date" id="fd2_');
        html.push(columns[columnIndex].name);
        html.push('" style="width: 120px; font-size: 12px;" value="');
        html.push(formatDate(columns[columnIndex].filterEndDate));
        html.push('" onkeydown="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 2, this)" onchange="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 3, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px;display:inline">Between Dates</label><br/>');
    }
    else if (columns[columnIndex].filterDateOption == 3) {
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 0, this)" /><label for="dfo_');
        html.push(columnIndex);
        html.push('_0" style="font-size:12px;display:inline">On Date</label><br />');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 1, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_1" style="font-size:12px;display:inline">On or Before Date</label><br/>');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_2" style="font-size:12px;display:inline">On or After Date</label><br/>');
        html.push('<input type="radio" name="dfo_');
        html.push(columnIndex);
        html.push('" id="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px"  checked="checked" onchange="dateFilterOptionChanged(');
        html.push(columnIndex);
        html.push(', 3, this)"/><label for="dfo_');
        html.push(columnIndex);
        html.push('_3" style="font-size:12px;display:inline">Between Dates:</label><br />');
        html.push('<input type="date" id="fd1_');
        html.push(columns[columnIndex].name);
        html.push('" style="width: 120px; font-size: 12px;" value="');
        html.push(formatDate(columns[columnIndex].filterStartDate));
        html.push('" onkeydown="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)" onchange="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 1, this)"><span style="font-size:12px;"> and </span>');
        html.push('<input type="date" id="fd2_');
        html.push(columns[columnIndex].name);
        html.push('" style="width: 120px; font-size: 12px;" value="');
        html.push(formatDate(columns[columnIndex].filterEndDate));
        html.push('" onkeydown="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 2, this)" onchange="filterDatesChanged(');
        html.push(columnIndex);
        html.push(', 2, this)"><br />');
    }
    return html.join('');
}

function dateFilterOptionChanged(columnIndex, option, comp) {
    columns[columnIndex].filterDateOption = option;
    document.getElementById('dfd_' + columnIndex).innerHTML = renderDateFilter(columnIndex);
}

function filterDatesChanged(columnIndex, target, comp) {
    if (target == 1) {
        columns[columnIndex].filterStartDate = Date.parse(comp.value).withoutTime();
    }
    else if (target == 2) {
        columns[columnIndex].filterEndDate = Date.parse(comp.value).withoutTime();
    }
}

function formatDate(date) {
    if (date == null)
        return '';
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatMoney(dc) {
    try {
        return dc.toLocaleString("en-US", { style: "decimal", useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    catch (err) {
        return '';
    }
}

function getFilterOptions(columnName) {
    var map = {};
    var list = [];
    for (var i = 0; i < itemList.length; i++) {
        var v = itemList[i][columnName].Value;
        if (map[v] == null) {
            map[v] = 1;
            list.push(v);
        }
        else {
            map[v] = map[v] + 1;
        }
    }
    list.sort();
    var list2 = [];
    for (var i = 0; i < list.length; i++) {
        list2.push({ text: list[i], checked: true, count: map[list[i]], filteredCount: map[list[i]] });
    }
    return list2;
}

function getRecordById(recordId) {
    for (var i = 0; i < itemList.length; i++)
        if (itemList[i].id === recordId)
            return itemList[i];
    return null;
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function showProgressPanel(message) {
    //document.getElementById("ProgressPanel").style.visibility = "visible";
    //document.getElementById("ProgressMessage").innerHTML = message;
    //document.getElementById("ProgressMessage").focus();
}

function hideProgressPanel() {
    //document.getElementById("ProgressPanel").style.visibility = "hidden";
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

window.onmousemove = function (event) {
    changeGridWidth(event);
    resizeColumn(event);
}

window.onmouseup = function (event) {
    stopGridWidthChange(event);
    stopColumnResize(event);
}

//window.onresize = function () {
//   // resizeGrid();
//   // setGridHeight();
//}