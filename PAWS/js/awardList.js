var gridId = '093A4C8D-08E0-E911-A987-001DD80081AD';
var pageSize = 15;
var sortColumn = 'title';
var sortAsc = true;
var maxWidth = 1370;
var resizingGrid = false;
var showAllRecords = false;

var columns = [
    {
        name: 'title',
        type: 'link',
        title: '  Award Title',
        description: '  Award Title',
        sortable: true,
        resizeable: false,
        filterType: 'none',
        filterActive: false,
        filterOptions: [],
        filterAllOptionsChecked: true,
        filterText: '',
        filterStartDate: null,
        filterEndDate: null,
        filterDateOption: 0,
        width: 750,
        modifiedWidth: 750,
        align: 'left'
    },
    {
        name: 'awardNumber',
        type: 'text',
        title: 'Award Number',
        description: 'Award Number',
        sortable: true,
        resizeable: false,
        filterType: 'none',
        filterActive: false,
        filterOptions: [],
        filterAllOptionsChecked: true,
        filterText: '',
        filterStartDate: null,
        filterEndDate: null,
        filterDateOption: 0,
        width: 150,
        modifiedWidth: 150,
        align: 'left'
    },
    {
        name: 'certifications',
        type: 'text',
        title: 'NYS Certifications Available',
        description: 'NYS Certifications Available',
        sortable: true,
        resizeable: false,
        filterType: 'none',
        filterActive: false,
        filterOptions: [],
        filterAllOptionsChecked: true,
        filterText: '', filterStartDate: null,
        filterEndDate: null,
        filterDateOption: 0,
        width: 150,
        modifiedWidth: 150,
        align: 'left'
    },
    {
        name: 'eMarketplace',
        type: 'date',
        title: 'eMarketplace',
        description: 'eMarketplace',
        sortable: true,
        resizeable: false,
        filterType: 'none',
        filterActive: false,
        filterOptions: [],
        filterAllOptionsChecked: true,
        filterText: '',
        filterStartDate: null,
        filterEndDate: null,
        filterDateOption: 0,
        width: 150,
        modifiedWidth: 150,
        align: 'left'
    },
    {
        name: 'awardType',
        type: 'text',
        title: 'Contract Type',
        description: 'Contract Type',
        sortable: true,
        resizeable: false,
        filterType: 'none',
        filterActive: false,
        filterOptions: [],
        filterAllOptionsChecked: true,
        filterText: '',
        filterStartDate: null,
        filterEndDate: null,
        filterDateOption: 0,
        width: 150,
        modifiedWidth: 150,
        align: 'left'
    }
];

function loadAwardList() {
    renderHeader();
    document.getElementById('countLabel').innerHTML = "&nbsp;";
    document.getElementById('pagerPanel').innerHTML = "&nbsp;";
    showProgressPanel('Please wait while loading the list ...');
    setTimeout(function () { loadAwardList2(); }, 100);
}

function loadAwardList2() {
    pageNumber = 0;
    itemList = [];
    var req = new XMLHttpRequest();
    var url = "/services/award-search-service/?t=" + (new Date()).getTime();
    req.open("GET", url, true);
    req.onreadystatechange = function () {
        if (req.readyState === 4 /* complete */) {
            req.onreadystatechange = null; //Addresses potential memory leak issue with IE
            if (req.status === 200) {
                var awardList = JSON.parse(this.responseText);
                for (var i = 0; i < awardList.length; i++) {
                    var itemInfo = {
                        awardId: '',
                        awardNumber: { Value: '', SortData: '' },
                        title: { Value: '', SortData: '' },
                        certifications: { Value: '', SortData: '' },
                        eMarketplace: { Value: '', SortData: '' },
                        awardType: { Value: '', SortData: '' },
                        wbe: false,
                        mbe: false,
                        svdob: false,
                        isCommodity: false,
                        isTechnology: false,
                        isService: false,
                        filteredOut: false,
                        filteredOut2: false
                    };

                    itemInfo.awardId = awardList[i].awardId;

                    itemInfo.awardNumber.Value = decodeURIComponent(awardList[i].awardNumber);
                    itemInfo.awardNumber.SortData = itemInfo.awardNumber.Value.toLowerCase();

                    itemInfo.title.Value = decodeURIComponent(awardList[i].title);
                    itemInfo.title.SortData = itemInfo.title.Value.toLowerCase();

                    itemInfo.eMarketplace.Value = decodeURIComponent(awardList[i].eMarketplace);
                    itemInfo.eMarketplace.SortData = itemInfo.eMarketplace.Value.toLowerCase();

                    itemInfo.awardType.Value = decodeURIComponent(awardList[i].awardType);
                    itemInfo.awardType.SortData = itemInfo.awardType.Value.toLowerCase();

                    itemInfo.wbe = awardList[i].wbe.length > 0;
                    itemInfo.mbe = awardList[i].mbe.length > 0;
                    itemInfo.svdob = awardList[i].svdob.length > 0;
                    var cList = [];
                    if (itemInfo.mbe)
                        cList.push('MBE');
                    if (itemInfo.wbe)
                        cList.push('WBE');
                    if (itemInfo.svdob)
                        cList.push('SDVOB');
                    if (cList.length > 0)
                        itemInfo.certifications = cList.join(', ');
                    else
                        itemInfo.certifications = '—';


                    itemInfo.isCommodity = itemInfo.awardType.SortData == 'commodity';
                    itemInfo.isTechnology = itemInfo.awardType.SortData == 'technology';
                    itemInfo.isService = itemInfo.awardType.SortData == 'service';

                    itemList.push(itemInfo);
                }
                for (i = 0; i < columns.length; i++) {
                    columns[i].filterActive = false;
                    if (columns[i].filterType === 'uniqueoptions') {
                        columns[i].filterAllOptionsChecked = true;
                        columns[i].filterOptions = getFilterOptions(columns[i].name);
                    }
                }
                updateSearchResultMessage(keyword);
                renderHeader();
                sortGrid();
                hideProgressPanel();
            }
        }
    };
    req.send();
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

function renderHeader() {
    var html = [];
    html.push('<table><tbody><tr class="gridHeaderRow">');
    for (var i = 0; i < columns.length; i++) {
        html.push('<td id="col');
        html.push(i);
        html.push('" class="tdu" style="min-width:');
        html.push(columns[i].width - 8);
        html.push('px;max-width:');
        html.push(columns[i].width - 8);
        html.push('px;"><div id="div');
        html.push(i);
        html.push('" class="fixedHeader" style="width:');
        html.push(columns[i].width > 20 ? (columns[i].width - 30) : 0);
        html.push('px;text-align:left;');
        html.push(columns[i].sortable ? 'cursor:pointer;' : '');
        html.push('" title="');
        html.push(columns[i].description);


        if (columns[i].width > 10) {
            // sortable
            if (columns[i].sortable) {
                html.push('" onclick="sortByColumn(&quot;');
                html.push(columns[i].name);
                html.push('&quot;)">&nbsp;');
                html.push(columns[i].title);
                html.push('</div><img id="si');
                html.push(columns[i].name);
                html.push('" src="/resources/empSort.png" class="headerSortImg">');
            }
            else {
                html.push('">&nbsp;');
                html.push(columns[i].title);
                html.push('</div>');
            }
        }
        else {
            html.push('"></div>');
        }


        // filterable
        if (columns[i].width > 10) {
            if (columns[i].filterType != 'none') {
                html.push('<img id="fi_');
                html.push(columns[i].name);
                html.push('" style="cursor:pointer;" src="/resources/');
                html.push(columns[i].filterActive ? 'a' : 'd');
                html.push('Filter.gif" onclick="openFilter(');
                html.push(i);
                html.push(', this)">');
                html.push('<div id="filterPanel_');
                html.push(columns[i].name);
                html.push('" style="display:none;position:absolute;border:1px solid gray;background-color:rgb(219, 232, 255);min-width:250px;text-align:left;padding-left:20px;padding-top:7px;padding-bottom:7px;z-index:1000;"></div>');
            }
            else {
                //html.push('<img src="/resources/empSort.png">');
            }
        }
        html.push('</td>');

        // resizeable
        if (columns[i].resizeable) {
            html.push('<td class="tdu" style="min-width:5px;max-width:5px"><img src="/resources/bar.png" style="cursor:w-resize;max-width:none !important;" onmousedown="startColumnResize(event, ');
            html.push(i);
            html.push(', this)" /></td>');
        }
        else {
            //html.push('<td class="tdu" style="min-width:5px;max-width:5px"><img src="/resources/bar.png" style="max-width:none !important;"/></td>');
            html.push('<td class="tdu" style="min-width:5px;max-width:5px"></td>');
        }
    }
    html.push('</tr></tbody></table>');
    document.getElementById('headerContainer').innerHTML = html.join('');
}

function renderGrid() {

    for (var i = 0; i < columns.length; i++) {
        var sortImage = document.getElementById('si' + columns[i].name);
        if (sortImage != null) {
            if (sortColumn == columns[i].name) {
                if (sortAsc)
                    sortImage.src = '/resources/ascSort.png';
                else
                    sortImage.src = '/resources/desSort.png';
            }
            else {
                sortImage.src = '/resources/empSort.png';
            }
        }
    }

    filtereditemList = [];
    for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].filteredOut == false)
            filtereditemList.push(itemList[i]);
    }

    var html = [];
    html.push('<table>');
    var startIndex = pageNumber * pageSize;
    var endIndex = startIndex + pageSize - 1;
    if (endIndex >= filtereditemList.length)
        endIndex = filtereditemList.length - 1;

    if (showAllRecords) {
        startIndex = 0;
        endIndex = filtereditemList.length - 1;
        pageNumber = 0;
    }

    for (var i = startIndex; i <= endIndex; i++) {
        html.push(renderRow(filtereditemList[i], i));
    }
    html.push('</table>');
    document.getElementById('gridContainer').innerHTML = html.join('');

    var selectedTypeCount = 0;
    var commChecked = document.getElementById("commodityFilterCheck").checked;
    var techChecked = document.getElementById("technologyFilterCheck").checked;
    var servChecked = document.getElementById("serviceFilterCheck").checked;
    if (commChecked || techChecked || servChecked) {
        for (var i = 0; i < itemList.length; i++) {
            if (commChecked && itemList[i].isCommodity ||
                techChecked && itemList[i].isTechnology ||
                servChecked && itemList[i].isService)
                selectedTypeCount++;
        }
    }
    else {
        selectedTypeCount = itemList.length;
    }
    document.getElementById('countLabel').innerHTML = selectedTypeCount;

    // print pager panel
    if (filtereditemList.length > pageSize) {
        if (showAllRecords) {
            var pagerHtml = ['<table style="width: 100%; text-align: right"><tbody style="border: 0px;"><tr><td></td><td style="text-align: right; width: 10%;"><table><tbody style="border: 0px;"><tr>']; // <td>Go to Page#: </td>
            pagerHtml.push('<td class="pagerCell"><button class="activePageButton" onclick="javascript:showAllPages(false)" style="white-space:nowrap;">View Pages</button></td>');
            pagerHtml.push('</tr></tbody></table></td></tr></tbody></table>');
            document.getElementById('pagerPanel').innerHTML = pagerHtml.join('');
        }
        else {
            var pageCount = Math.ceil(filtereditemList.length / pageSize);
            var pagerHtml = ['<table style="width: 100%; text-align: right"><tbody style="border: 0px;"><tr><td></td><td style="text-align: right; width: 10%;"><table><tbody style="border: 0px;"><tr>']; // <td>Go to Page#: </td>

            pagerHtml.push('<td class="pagerCell"><button class="activePageButton" onclick="javascript:showAllPages(true)" style="margin-right:40px; white-space:nowrap;">View All</button></td>');

            pagerHtml.push('<td class="pagerCell"><button');
            if (pageNumber > 0) {
                pagerHtml.push(' class="activePageButton" onclick="javascript:gotoPage(');
                pagerHtml.push(pageNumber - 1);
                pagerHtml.push(')"');
            }
            else {
                pagerHtml.push(' disabled="disabled" class="inactivePageButton"');
            }
            pagerHtml.push('>Previous</button></td>');

            for (var i = 0; i < pageCount; i++) {
                pagerHtml.push('<td class="pagerCell">');
                if (pageNumber === i) {
                    pagerHtml.push('<button class="currentPageButton">');
                    pagerHtml.push(i + 1);
                    pagerHtml.push('</button>');
                }
                else {
                    pagerHtml.push('<button class="activePageButton" onclick="javascript:gotoPage(');
                    pagerHtml.push(i);
                    pagerHtml.push(')">');
                    pagerHtml.push(i + 1);
                    pagerHtml.push('</button>');
                }
                pagerHtml.push('</td>');
            }

            pagerHtml.push('<td class="pagerCell"><button');
            if (pageNumber < pageCount - 1) {
                pagerHtml.push(' class="activePageButton" onclick="javascript:gotoPage(');
                pagerHtml.push(pageNumber + 1);
                pagerHtml.push(')"');
            }
            else {
                pagerHtml.push(' disabled="disabled" class="inactivePageButton"');
            }
            pagerHtml.push('>Next</button></td>');

            pagerHtml.push('</tr></tbody></table></td></tr></tbody></table>');
            document.getElementById('pagerPanel').innerHTML = pagerHtml.join('');
        }
    }
    else {
        document.getElementById('pagerPanel').innerHTML = '';
    }
    hideProgressPanel();
}

function renderRow(lineInfo, rowIndex) {

    var rowHtml = [];
    rowHtml.push("<tr class='gridRow");
    if (rowIndex % 2 === 1) {
        rowHtml.push(" gridRowAlternate' data-odd='1'");
    }
    else {
        rowHtml.push("'");
    }
    rowHtml.push(" id='tr_");
    rowHtml.push(lineInfo.leadId);
    rowHtml.push("'>");

    for (var i = 0; i < columns.length; i++) {
        rowHtml.push("<td class='gridCellBorder' style='vertical-align:middle;min-width:");
        rowHtml.push(columns[i].width - 1);
        rowHtml.push("px;max-width:");
        rowHtml.push(columns[i].width - 1);
        rowHtml.push("px'><div class='fixedCell' style='width:");
        rowHtml.push(columns[i].width - 3);
        rowHtml.push("px;text-align:");
        rowHtml.push(columns[i].align);
        rowHtml.push("'>");
        rowHtml.push("<span class='unModifiedCellSpan' title='");
        if (columns[i].type === 'link') {
            rowHtml.push(htmlEscape(lineInfo[columns[i].name].Value));
            rowHtml.push("'>");
            if (columns[i].width > 10) {
                rowHtml.push("<a href='/award-overview/?id=");
                rowHtml.push(lineInfo.awardId);
                rowHtml.push("' target='_self'>")
                rowHtml.push(htmlEscape(lineInfo[columns[i].name].Value));
                rowHtml.push("</a>");
            }
        }
        else if (columns[i].type === 'text') {
            rowHtml.push(htmlEscape(lineInfo[columns[i].name].Value));
            rowHtml.push("'>");
            if (columns[i].width > 10)
                rowHtml.push(htmlEscape(lineInfo[columns[i].name].Value));
        }
        else if (columns[i].type === 'datetime') {
            rowHtml.push(formatDateTime(lineInfo[columns[i].name].Value));
            rowHtml.push("'>");
            if (columns[i].width > 10)
                rowHtml.push(formatDateTime(lineInfo[columns[i].name].Value));
        }
        else if (columns[i].type === 'date') {
            rowHtml.push(lineInfo[columns[i].name].Value);
            rowHtml.push("'>");
            if (columns[i].width > 10)
                rowHtml.push(lineInfo[columns[i].name].Value);
        }
        else if (columns[i].type === 'number') {
            rowHtml.push(lineInfo[columns[i].name].Value);
            rowHtml.push("'>");
            if (columns[i].width > 10)
                rowHtml.push(lineInfo[columns[i].name].Value);
        }
        else if (columns[i].type === 'money') {
            var mv = lineInfo[columns[i].name].Value;
            if (mv !== '' && lineInfo.currency !== '') {
                rowHtml.push(lineInfo.currency);
                rowHtml.push('&nbsp;');
                rowHtml.push(formatMoney(lineInfo[columns[i].name].Value));
                rowHtml.push("'>");
                if (columns[i].width > 10) {
                    rowHtml.push(lineInfo.currency);
                    rowHtml.push(formatMoney(lineInfo[columns[i].name].Value));
                }
            }
            else {
                rowHtml.push("'>");
            }
        }
        if (columns[i].align === 'right')
            rowHtml.push('&nbsp;');
        rowHtml.push("</span>");
        rowHtml.push("</div></td>");
    }

    rowHtml.push("</tr>");
    return rowHtml.join('');
}

function searchAwards() {
    filterAwardList();

}

function handleKeyDown(comp, e) {
    //if (e.keyCode === 13) {
    setTimeout('filterAwardList()', 10);
    //}
}

function updateSearchResultMessage(keyword, count) {
    var msg = [];
    if (keyword.length > 0) {
        if (count === 0) {
            msg.push('<span class="searchResultCount">No</span> result');
        }
        else if (count === 1) {
            msg.push('<span class="searchResultCount">One</span> result');
        }
        else {
            msg.push('<span class="searchResultCount">');
            msg.push(count);
            msg.push('</span> results');
        }
        msg.push(' found for search "<span class="searchResultKeyword">')
        msg.push(keyword);
        msg.push('</span>"&nbsp;&nbsp;&nbsp;<a href="javascript:clearSearch()" class="searchResultClear">X&nbsp;Clear Result</a>');
        document.getElementById("searchResults").innerHTML = msg.join('');
    }
    else {
        document.getElementById("searchResults").innerHTML = "";
    }
}

function clearSearch() {
    document.getElementById("keyword").value = "";
    filterAwardList();
}

function filterAwardList() {
    var keyword = document.getElementById("keyword").value;
    if (keyword === null)
        keyword = "";
    var commChecked = document.getElementById("commodityFilterCheck").checked;
    var techChecked = document.getElementById("technologyFilterCheck").checked;
    var servChecked = document.getElementById("serviceFilterCheck").checked;

    for (var i = 0; i < itemList.length; i++) {
        itemList[i].filteredOut = false;
    }

    if (commChecked || techChecked || servChecked) {
        for (var i = 0; i < itemList.length; i++) {
            itemList[i].filteredOut =
                (commChecked && itemList[i].isCommodity ||
                    techChecked && itemList[i].isTechnology ||
                    servChecked && itemList[i].isService) == false;
        }
    }
    var keywordSearchCount = 0;

    if (keyword != null && keyword.length > 0) {
        var keywordLC = keyword.toLowerCase();
        for (var i = 0; i < itemList.length; i++) {
            if (itemList[i].filteredOut == false) {
                itemList[i].filteredOut =
                    (itemList[i].title.SortData.indexOf(keywordLC) >= 0 ||
                        itemList[i].awardNumber.SortData.indexOf(keywordLC) >= 0) == false;

            }
            if (itemList[i].filteredOut == false)
                keywordSearchCount++;
        }
    }

    updateSearchResultMessage(keyword, keywordSearchCount);
    renderHeader();
    renderGrid();
}

function showAllPages(showAll) {
    showAllRecords = showAll;
    renderGrid();
}
