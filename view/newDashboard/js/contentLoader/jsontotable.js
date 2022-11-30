/**
 * JavaScript format string function
 * 
 */
String.prototype.format = function () {
    var args = arguments;

    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] :
            '{' + number + '}';
    });
};


/**
 * Convert a Javascript Oject array or String array to an HTML table
 * JSON parsing has to be made before function call
 * It allows use of other JSON parsing methods like jQuery.parseJSON
 * http(s)://, ftp://, file:// and javascript:; links are automatically computed
 *
 * JSON data samples that should be parsed and then can be converted to an HTML table
 *     var objectArray = '[{"Total":"34","Version":"1.0.4","Office":"New York"},{"Total":"67","Version":"1.1.0","Office":"Paris"}]';
 *     var stringArray = '["New York","Berlin","Paris","Marrakech","Moscow"]';
 *     var nestedTable = '[{ key1: "val1", key2: "val2", key3: { tableId: "tblIdNested1", tableClassName: "clsNested", linkText: "Download", data: [{ subkey1: "subval1", subkey2: "subval2", subkey3: "subval3" }] } }]'; 
 *
 * Code sample to create a HTML table Javascript String
 *     var jsonHtmlTable = ConvertJsonToTable(eval(dataString), 'jsonTable', null, 'Download');
 *
 * Code sample explaned
 *  - eval is used to parse a JSON dataString
 *  - table HTML id attribute will be 'jsonTable'
 *  - table HTML class attribute will not be added
 *  - 'Download' text will be displayed instead of the link itself
 *
 * @author Afshin Mehrabani <afshin dot meh at gmail dot com>
 * 
 * @class ConvertJsonToTable
 * 
 * @method ConvertJsonToTable
 * 
 * @param parsedJson object Parsed JSON data
 * @param tableId string Optional table id 
 * @param tableClassName string Optional table css class name
 * @param linkText string Optional text replacement for link pattern
 *  
 * @return string Converted JSON to HTML table
 */
function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText) {
    //Patterns for links and NULL value
    var italic = '<i>{0}</i>';
    var link = linkText ? '<a href="{0}">' + linkText + '</a>' :
        '<a href="{0}">{0}</a>';

    //Pattern for table                          
    var idMarkup = tableId ? ' id="' + tableId + '"' :
        '';

    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' :
        '';

    var tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

    //Patterns for table content
    var th = '<thead>{0}</thead>';
    var tb = '<tbody>{0}</tbody>';
    var tr = '<tr>{0}</tr>';
    var thRow = '<th>{0}</th>';
    var tdRow = '<td>{0}</td>';
    var thCon = '';
    var tbCon = '';
    var trCon = '';

    if (parsedJson) {
        var isStringArray = typeof (parsedJson[0]) == 'string';
        var headers;

        // Create table headers from JSON data
        // If JSON data is a simple string array we create a single table header
        if (isStringArray)
            thCon += thRow.format('value');
        else {
            // If JSON data is an object array, headers are automatically computed
            if (typeof (parsedJson[0]) == 'object') {
                headers = array_keys(parsedJson[0]);

                for (var i = 0; i < headers.length; i++)
                    thCon += thRow.format(headers[i]);
            }
        }
        th = th.format(tr.format(thCon));

        // Create table rows from Json data
        if (isStringArray) {
            for (var i = 0; i < parsedJson.length; i++) {
                tbCon += tdRow.format(parsedJson[i]);
                trCon += tr.format(tbCon);
                tbCon = '';
            }
        }
        else {
            if (headers) {
                var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

                for (var i = 0; i < parsedJson.length; i++) {
                    for (var j = 0; j < headers.length; j++) {
                        var value = parsedJson[i][headers[j]];
                        var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

                        if (isUrl)   // If value is URL we auto-create a link
                            tbCon += tdRow.format(link.format(value));
                        else {
                            if (value) {
                                if (typeof (value) == 'object') {
                                    //for supporting nested tables
                                    tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                                } else {
                                    tbCon += tdRow.format(value);
                                }

                            } else {    // If value == null we format it like PhpMyAdmin NULL values
                                tbCon += tdRow.format(italic.format(value).toUpperCase());
                            }
                        }
                    }
                    trCon += tr.format(tbCon);
                    tbCon = '';
                }
            }
        }
        tb = tb.format(trCon);
        tbl = tbl.format(th, tb);

        return tbl;
    }
    return null;
}


/**
 * Return just the keys from the input array, optionally only for the specified search_value
 * version: 1109.2015
 *  discuss at: http://phpjs.org/functions/array_keys
 *  +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +      input by: Brett Zamir (http://brett-zamir.me)
 *  +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +   improved by: jd
 *  +   improved by: Brett Zamir (http://brett-zamir.me)
 *  +   input by: P
 *  +   bugfixed by: Brett Zamir (http://brett-zamir.me)
 *  *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
 *  *     returns 1: {0: 'firstname', 1: 'surname'}
 */
function array_keys(input, search_value, argStrict) {
    var search = typeof search_value !== 'undefined', tmp_arr = [], strict = !!argStrict, include = true, key = '';

    if (input && typeof input === 'object' && input.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return input.keys(search_value, argStrict);
    }

    for (key in input) {
        if (input.hasOwnProperty(key)) {
            include = true;
            if (search) {
                if (strict && input[key] !== search_value)
                    include = false;
                else if (input[key] != search_value)
                    include = false;
            }
            if (include)
                tmp_arr[tmp_arr.length] = key;
        }
    }
    return tmp_arr;
}

var nestedTable = [{
    key1: "val1",
    key2: "val2",
    key3: {
        tableId: "tblIdNested1",
        tableClassName: "clsNested",
        linkText: "Download",
        data: [{
            subkey1: "subval1",
            subkey2: "subval2",
            subkey3: "subval3"
        }]
    }
}];
var mydata = { "system": { "System": "Linux", "Node Name": "seyedPC", "Release": "5.15.0-53-generic", "Version": "#59-Ubuntu SMP Mon Oct 17 18:53:30 UTC 2022", "Architecture": "x86_64", "Processor": "x86_64", "Boot Time": "2022/11/30 8:43:9" }, "specs": { "memory": { "id": "memory", "class": "memory", "claimed": true, "description": "System memory", "physid": "0", "units": "bytes", "size": 17179869184 }, "cpu": { "id": "cpu", "class": "processor", "claimed": true, "product": "Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz", "vendor": "Intel Corp.", "physid": "1", "businfo": "cpu@0", "version": "6.165.3", "units": "Hz", "size": 4002723000, "capacity": 4300000000, "width": 64, "configuration": { "microcode": "240" }, "capabilities": { "fpu": "mathematical co-processor", "fpu_exception": "FPU exceptions reporting", "wp": true, "vme": "virtual mode extensions", "de": "debugging extensions", "pse": "page size extensions", "tsc": "time stamp counter", "msr": "model-specific registers", "pae": "4GB+ memory addressing (Physical Address Extension)", "mce": "machine check exceptions", "cx8": "compare and exchange 8-byte", "apic": "on-chip advanced programmable interrupt controller (APIC)", "sep": "fast system calls", "mtrr": "memory type range registers", "pge": "page global enable", "mca": "machine check architecture", "cmov": "conditional move instruction", "pat": "page attribute table", "pse36": "36-bit page size extensions", "clflush": true, "dts": "debug trace and EMON store MSRs", "acpi": "thermal control (ACPI)", "mmx": "multimedia extensions (MMX)", "fxsr": "fast floating point save/restore", "sse": "streaming SIMD extensions (SSE)", "sse2": "streaming SIMD extensions (SSE2)", "ss": "self-snoop", "ht": "HyperThreading", "tm": "thermal interrupt and status", "pbe": "pending break event", "syscall": "fast system calls", "nx": "no-execute bit (NX)", "pdpe1gb": true, "rdtscp": true, "x86-64": "64bits extensions (x86-64)", "constant_tsc": true, "art": true, "arch_perfmon": true, "pebs": true, "bts": true, "rep_good": true, "nopl": true, "xtopology": true, "nonstop_tsc": true, "cpuid": true, "aperfmperf": true, "pni": true, "pclmulqdq": true, "dtes64": true, "monitor": true, "ds_cpl": true, "vmx": true, "est": true, "tm2": true, "ssse3": true, "sdbg": true, "fma": true, "cx16": true, "xtpr": true, "pdcm": true, "pcid": true, "sse4_1": true, "sse4_2": true, "x2apic": true, "movbe": true, "popcnt": true, "tsc_deadline_timer": true, "aes": true, "xsave": true, "avx": true, "f16c": true, "rdrand": true, "lahf_lm": true, "abm": true, "3dnowprefetch": true, "cpuid_fault": true, "epb": true, "invpcid_single": true, "ssbd": true, "ibrs": true, "ibpb": true, "stibp": true, "ibrs_enhanced": true, "tpr_shadow": true, "vnmi": true, "flexpriority": true, "ept": true, "vpid": true, "ept_ad": true, "fsgsbase": true, "tsc_adjust": true, "bmi1": true, "avx2": true, "smep": true, "bmi2": true, "erms": true, "invpcid": true, "mpx": true, "rdseed": true, "adx": true, "smap": true, "clflushopt": true, "intel_pt": true, "xsaveopt": true, "xsavec": true, "xgetbv1": true, "xsaves": true, "dtherm": true, "ida": true, "arat": true, "pln": true, "pts": true, "hwp": true, "hwp_notify": true, "hwp_act_window": true, "hwp_epp": true, "md_clear": true, "flush_l1d": true, "arch_capabilities": true, "cpufreq": "CPU Frequency scaling" } }, "network": { "id": "pci:2", "class": "bridge", "claimed": true, "handle": "PCIBUS:0000:03", "description": "PCI bridge", "product": "Intel Corporation", "vendor": "Intel Corporation", "physid": "1c.3", "businfo": "pci@0000:00:1c.3", "version": "f0", "width": 32, "clock": 33000000, "configuration": { "driver": "pcieport" }, "capabilities": { "pci": true, "normal_decode": true, "bus_master": "bus mastering", "cap_list": "PCI capabilities listing" }, "children": [{ "id": "network", "class": "network", "claimed": true, "handle": "PCI:0000:03:00.0", "description": "Ethernet interface", "product": "RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller", "vendor": "Realtek Semiconductor Co., Ltd.", "physid": "0", "businfo": "pci@0000:03:00.0", "logicalname": "enp3s0", "version": "15", "serial": "24:4b:fe:79:49:6a", "units": "bit/s", "size": 1000000000, "capacity": 1000000000, "width": 64, "clock": 33000000, "configuration": { "autonegotiation": "on", "broadcast": "yes", "driver": "r8169", "driverversion": "5.15.0-53-generic", "duplex": "full", "firmware": "rtl8168h-2_0.0.2 02/26/15", "ip": "192.168.5.104", "latency": "0", "link": "yes", "multicast": "yes", "port": "twisted pair", "speed": "1Gbit/s" }, "capabilities": { "bus_master": "bus mastering", "cap_list": "PCI capabilities listing", "ethernet": true, "physical": "Physical interface", "tp": "twisted pair", "mii": "Media Independent Interface", "10bt": "10Mbit/s", "10bt-fd": "10Mbit/s (full duplex)", "100bt": "100Mbit/s", "100bt-fd": "100Mbit/s (full duplex)", "1000bt-fd": "1Gbit/s (full duplex)", "autonegotiation": "Auto-negotiation" } }] } } }
var jsonHtmlTable = ConvertJsonToTable(nestedTable, 'jsonTable', 'table table-striped', 'Download');
$('#test').html(jsonHtmlTable)