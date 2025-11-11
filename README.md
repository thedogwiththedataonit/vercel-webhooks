app.post("/vercel-webhook", async (req, res) => {
  // Verify signature first
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.type === "project.created") {
    const { id: projectId, name, ownerId } = event.payload.project;

    // Fetch full project details
    const project = await vercel.projects.getProject({ 
      idOrName: projectId, 
      teamId 
    });

    const hasGit = Boolean(project.link?.type);

    if (!hasGit) {
      // 1) Lock with deployment protection
      await vercel.projects.updateProject({
        idOrName: projectId,
        teamId,
        requestBody: {
          protectionBypass: { 
            scope: "all" // or "non-production"
          }
        }
      });

      // 2) Log for audit
      await logCompliance({
        projectId,
        projectName: name,
        action: "LOCKED_NO_GIT",
        timestamp: new Date()
      });

      // 3) Notify
      await notifyOwners(project, 
        `Project "${name}" was locked. Connect a GitHub repo within 48h.`
      );

      // 4) Optional: Schedule deletion check
      await scheduleComplianceCheck(projectId, "48h");
    }
  }

  res.sendStatus(200);
});# vercel-webhooks
