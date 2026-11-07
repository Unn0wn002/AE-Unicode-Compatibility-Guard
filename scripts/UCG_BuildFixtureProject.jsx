#target aftereffects

/*
Fixture builder for the Unicode Compatibility Guard tests.
THIS SCRIPT MODIFIES THE OPEN PROJECT (it imports files). Run it ONLY in a disposable project.
It reads _qa_scratch/fixtures/manifest.txt (one relative path per line, UTF-8), or absolute paths
when a line starts with a drive letter, and imports each file.
*/

(function UCG_BuildFixtureProject() {
    var repo = File($.fileName).parent.parent;
    var fixtures = new Folder(repo.fsName + "/_qa_scratch/fixtures");
    var manifest = new File(fixtures.fsName + "/manifest.txt");
    if (!manifest.exists) { alert("manifest.txt not found:\n" + manifest.fsName); return; }
    manifest.encoding = "UTF-8";
    manifest.open("r");
    var text = manifest.read();
    manifest.close();
    var lines = text.split("\n");
    var ok = 0, failed = [], i, ln, f, io;
    for (i = 0; i < lines.length; i++) {
        ln = lines[i].replace(/\r/g, "");
        if (ln === "") { continue; }
        f = /^[A-Za-z]:[\\\/]/.test(ln) ? new File(ln) : new File(fixtures.fsName + "/" + ln);
        try {
            io = new ImportOptions(f);
            app.project.importFile(io);
            ok++;
        } catch (e) {
            failed.push(ln + " -> " + e);
        }
    }
    alert("Fixture builder: imported " + ok + " file(s)." + (failed.length ? "\nFAILED:\n" + failed.join("\n") : ""));
})();
