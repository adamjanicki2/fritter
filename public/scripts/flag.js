/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewFlagsByParentId(fields) {
  fetch(`/api/flags?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFlag(fields) {
  fetch("/api/flags", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteFlag(fields) {
  fetch(`/api/flags/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
