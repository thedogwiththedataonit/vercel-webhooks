Put together webhook scripts for use cases

## Project is created with no git url

### Trigger
- project.created https://vercel.com/docs/webhooks/webhooks-api#project.created

### Check
- Get project using SDK (confirm) https://vercel.com/docs/rest-api/reference/endpoints/projects/find-a-project-by-id-or-name
- There are several references to git that we can use to confirm whether a project has a git repo attached

---

## Project creation triggers webhook to enable deployment projection on all deployments (including prod)
- project.created https://vercel.com/docs/webhooks/webhooks-api#project.created


### Trigger

### Check

---

## Project git url is changed or removed

### Trigger

### Check

---




The webhook URL receives an HTTP POST request with a JSON payload for each event. All the events have the following format:

webhook-payload
  "id": <eventId>,
  "type": <event-type>,
  "createdAt": <javascript-timestamp>,
  "payload": <payload for the event>,
  "region": <RegionId>,