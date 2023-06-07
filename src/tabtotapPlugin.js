
// // get tags and parent id field from Joplin API
// const tags = await joplin.data.get(['tags'], { fields: ['id', 'title', 'parent_id'] })
// const parentIdMap = {}
// for (let i = 0; i < tags.items.length; i++) {
//   parentIdMap[tags.items[i].id] = tags.items[i].parent_id
// }

// function createTagTree(parentId, tags) {
//   const tagList = []
//   for (const tag of tags) {
//     if (tag.parent_id === parentId) {
//       tagList.push({
//         id: tag.id,
//         title: tag.title,
//         children: createTagTree(tag.id, tags)
//       })
//     }
//   }
//   return tagList
// }

// // create tag tree
// const rootTags = createTagTree(null, tags.items)

// function renderTagTree(tagList) {
//   const ul = document.createElement('ul')
//   for (const tag of tagList) {
//     const li = document.createElement('li')
//     li.draggable = true
//     li.addEventListener('dragstart', function(e) {
//       e.dataTransfer.setData('tag-id', tag.id)
//     })
//     a.addEventListener('dragover', function(e) {
//       e.preventDefault()
//       b.classList.add('drag-over')
//     })
//     li.addEventListener('dragleave', function(e) {
//       this.classList.remove('drag-over')
//     })
//     li.addEventListener('drop', function(e) {
//       e.preventDefault()
//       this.classList.remove('drag-over')
//       const tagId = e.dataTransfer.getData('tag-id')
//       const newParentId = tag.id
//       const oldParentId = parentIdMap[tagId]
//       parentIdMap[tagId] = newParentId
//       joplin.data.put([{ id: tagId, parent_id: newParentId }])
//       renderTagTree(rootTags)
//     })
//     const span = document.createElement('span')
//     span.innerText = tag.title
//     span.addEventListener('click', function() {
//       joplin.views.dialogs.showMessageBox(`Search note`, `Search notes with tag: "${tag.title}"`, function() {
//         joplin.commands.execute('searchNotes', tag.id)
//       })
//     })
//     li.appendChild(span)
//     if (tag.children && tag.children.length > 0) {
//       li.appendChild(renderTagTree(tag.children))
//     }
//     ul.appendChild(li)
//   }
//   return ul
// }

// // render tag tree
// const container = document.createElement('div')
// container.appendChild(renderTagTree(rootTags))
// document.body.appendChild(container)