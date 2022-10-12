/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewCommentsById(fields) {
  fetch(`/api/comments?parentId=${fields.parentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createComment(fields) {
  fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.id}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
