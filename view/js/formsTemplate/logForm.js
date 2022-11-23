let logForm =
    `
<form>

    <div class="form-group" id="logForm">
        <label for="logFileName">Select the log file:</label>
        <select class="form-control" id="logFileName" name="file_name">
            <option value="syslog" selected="selected">System logs</option>
            <option value="auth.log">Authentication logs</option>
            <option value="boot.log">Boot logs</option>
            <option value="kern.log">kernel logs</option>
            <option value="faillog">Fail logs</option>
            <option value="dmesg">Kernel ring buffer messages (dmesg)</option>
        </select>
    </div>
    <div class="form-group">
        <label for="readDirection">From:</label>
        <select class="form-control" id="readDirection" name="direction">
            <option value="head" selected="selected">Top of the File</option>
            <option value="tail">Tail of the File</option>
        </select>
    </div>
    <div class="form-group">
        <label for="recordCount">Record Count:</label>
        <input type="number" class="form-control" id="recordCount" name="line_count" value="100">
    </div>
    <div>
    <input type="submit" id="logReq" class="btn btn-primary">
    </div>
</form>
`
export {logForm}