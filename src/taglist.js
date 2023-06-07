//jsstr += "$('#"+li.id+"').on('dragstart', function (e) { console.log('dragstart:+"+tag.id+"'); e.dataTransfer.setData('tag-id', '"+tag.id+"'); });"

/*
jquery on 绑定事件，需要：e.originalEvent.dataTransfer.
//     $(item).on('dragstart', function (e) {
//         console.log('dragstart:'+$(this).attr('id'))
//         e.originalEvent.dataTransfer.setData('tag-id', $(this).attr('id'))
//     })

直接html，ondragstart=tag_dragstart(event),需要：e.dataTransfer.
function tag_dragstart(e){
    console.log('dragstart:'+$(this).attr('id'))
    e.dataTransfer.setData('tag-id', $(this).attr('id'))
}

 */


function tag_dragstart(e,that){
    console.log('dragstart:'+$(that).attr('id'))
    e.dataTransfer.setData('tag-id', $(that).attr('id'))
}

function tag_dragover(e,that){
    console.log('dragover:')
    e.preventDefault()
    $(that).addClass('drag-over')
}

function tag_dragleave(e,that){
    console.log('dragleave:')
    $(that).removeClass('drag-over')
}

function tag_drop(e,that){
    console.log('drop:')
    e.preventDefault()
    $(that).removeClass('drag-over')
    const tagId = e.dataTransfer.getData('tag-id')
    const newParentId = $(that).attr('id')
    // const oldParentId = parentIdMap[tagId]
    // parentIdMap[tagId] = newParentId
    console.log('id:'+ tagId+ 'parent_id:'+ newParentId )
    webviewApi.postMessage({ name: 'tagdrop', id: tagId, newParentId: newParentId, });
}

function tag_click(e,that){
    const id = $(that).attr('id')
    console.log('click:'+id)
    webviewApi.postMessage({ name: 'tagclick', id: id,});
    // joplin.views.dialogs.showMessageBox(`Search note`)
    // joplin.views.dialogs.showMessageBox(`Search note`, `Search notes with tag: "${tag.title}"`, function() {
    // joplin.commands.execute('searchNotes', tag.id)
    // })
}

function removeTag(tagid,that){
    const id = $(that).attr('id')
    console.log('click:'+id)
    webviewApi.postMessage({ name: 'removeTag', id: tagid,});
}

function addNoteTag(tagid,that){
    const id = $(that).attr('id')
    console.log('click:'+id)
    webviewApi.postMessage({ name: 'addTag', id: tagid,});
}

function refresh(e,that){
    const id = $(that).attr('id')
    console.log('click:'+id)
    webviewApi.postMessage({ name: 'refreshTag', id: id,});
}

function openall(e,that){
	$("ul[id^='taglist']").each(function(){
		var bottleNo = $(this).css('display');
		if (bottleNo == 'none') {
			$(this).show()
            let tagperid = $(this).attr('id').replace('taglist','tagper')
            // $('#'+tagperid).text('----')
            $('#'+tagperid).attr('class','fas fa-folder-open')

		}
	});
}

function closeall(e,that){
    $("ul[id^='taglist']").each(function(){
        if($(this).attr('id') == 'taglist'){
            return
        }
		var bottleNo = $(this).css('display');
		if (bottleNo == 'block') {
			$(this).hide()
            let tagperid = $(this).attr('id').replace('taglist','tagper')
            // $('#'+tagperid).text('++')
            $('#'+tagperid).attr('class','fas fa-folder')
		}
	});
}

// $('ul').find('li').each(function(i,item){
//     console.log($(item).text())
//     $(item).on('dragstart', function (e) {
//         console.log('dragstart:'+$(this).attr('id'))
//         e.originalEvent.dataTransfer.setData('tag-id', $(this).attr('id'))
//     })
//     $(item).on('dragover', function (e) {
//         console.log('dragover:')
//         e.preventDefault()
//         this.classList.add('drag-over')
//     })
//     $(item).on('dragleave', function (e) {
//         console.log('dragleave:')
//         this.classList.remove('drag-over')
//     })
//     $(item).on('drop', function (e) {
//         console.log('drop:')
//         e.preventDefault()
//         this.classList.remove('drag-over')
//         const tagId = e.originalEvent.dataTransfer.getData('tag-id')
//         const newParentId = $(this).attr('id')
//         // const oldParentId = parentIdMap[tagId]
//         // parentIdMap[tagId] = newParentId
//         console.log('id:'+ tagId+ 'parent_id:'+ newParentId )
//         webviewApi.postMessage({ name: 'tagdrop', id: tagId, newParentId: newParentId, });

//         // 写入对应数据�? joplin.data.put([{ id: tagId, parent_id: newParentId }])
//         // renderTagTree(rootTags)
//     })

//     $(item).on('click', function () {
//         const id = $(this).attr('id')
//         console.log('click:'+id)
//         webviewApi.postMessage({ name: 'tagclick', id: id,});
//         // joplin.views.dialogs.showMessageBox(`Search note`)
//         // joplin.views.dialogs.showMessageBox(`Search note`, `Search notes with tag: "${tag.title}"`, function() {
//         // joplin.commands.execute('searchNotes', tag.id)
//         // })
//     })

// })
