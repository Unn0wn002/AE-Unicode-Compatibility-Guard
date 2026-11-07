#target aftereffects

/*
UG-03 fixture builder for the Unicode Compatibility Guard (ASCII only; ExtendScript ES3).
THIS SCRIPT MODIFIES THE OPEN PROJECT. Run it ONLY in a throwaway, saved project.
It adds one composition, puts it in the render queue and gives it TWO output modules:
  module 1: an ASCII output path under <repo>/_qa_scratch/ug03/out/
  module 2: a path whose file name is decomposed (NFD): U+304B U+3099 U+3081 U+3093 .mov
The Guard should list BOTH paths and warn about module 2 (combining characters).
It writes no files and starts no render.
*/

(function UCG_BuildOutputModuleFixture() {
    var repo = File($.fileName).parent.parent;
    var base = repo.fsName.replace(/\\/g, "/") + "/_qa_scratch/ug03/out";
    var nfdName = "\u304B\u3099\u3081\u3093.mov";
    var comp, rq, item, second;
    app.beginUndoGroup("UCG fixture: two output modules");
    try {
        comp = app.project.items.addComp("UG03_TWO_OUTPUT_MODULES", 1280, 720, 1, 5, 30);
        rq = app.project.renderQueue;
        item = rq.items.add(comp);
        item.outputModule(1).file = new File(base + "/ascii_module1.mov");
        second = item.outputModules.add();
        second.file = new File(base + "/" + nfdName);
        alert("UG-03 fixture built: render queue item " + rq.numItems + " has " + item.numOutputModules + " output modules.\n" +
              "1: " + item.outputModule(1).file.fsName + "\n2: " + item.outputModule(2).file.fsName +
              "\nSave this project (ASCII path), then scan with the Guard panel.");
    } catch (e) {
        alert("UG-03 fixture builder failed: " + e);
    }
    app.endUndoGroup();
})();
