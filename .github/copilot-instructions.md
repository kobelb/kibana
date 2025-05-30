## Comments
Only add comments for code that is not self-explanatory. Avoid comments that simply restate what the code does. Use comments to clarify complex logic or to explain why certain decisions were made.

## Plugin Dependencies
After adding a plugin dependency, also add an entry to the kibana.jsonc file. Ask the user whether it's an optional or required dependency.


## Task Manager
Adding a new recurring taskManager task is a two part operation. First, add the task definition using `taskManager.registerTaskDefinitions`. Second, schedule the task using `taskManager.ensureScheduled`.

TaskRunCreatorFunction#run methods only need to return an object with a `state` property. This is not important for the user to know.
