import joplin from 'api';
import { setupDatabase } from './database'


joplin.plugins.register({
	onStart: async function () {

		const currentNoteId = -1
		const panel = await joplin.views.panels.create("panel_1"); //To change

		await joplin.views.panels.onMessage(panel, (message) => {
			if (message.name === 'scrollToHash') {
				joplin.commands.execute('scrollToHash', message.hash)
			}
		});

		await joplin.views.panels.setHtml(panel, 'Loading...');

		async function updateTocView() {

			// get tags and parent id field from Joplin API
			const tags = await joplin.data.get(['tags'], { fields: ['id', 'title', 'parent_id'],
												order_by: "title",
      											order_dir: "ASC", })
			console.log('000')
			console.log(tags)
			const parentIdMap = {}
			for (let i = 0; i < tags.items.length; i++) {
				parentIdMap[tags.items[i].id] = tags.items[i].parent_id
			}
			console.log(parentIdMap)
			const tagsizeMap = {}
			for (var tagNote of await setupDatabase()){
				tagsizeMap[tagNote.tag_id] = tagNote.ct
			}

			function createTagTree(parentId, tags) {
				const tagList = []
				for (const tag of tags) {
					if (tag.parent_id === parentId) {
						tagList.push({
							id: tag.id,
							title: tag.title + "("+tagsizeMap[tag.id]+")",
							children: createTagTree(tag.id, tags)
						})
					}
				}
				return tagList
			}

			// create tag tree
			const rootTags = createTagTree('', tags.items)
			console.log(rootTags)

			function renderTagTree(tagList,parentid) {
				const ul = document.createElement('ul')
				ul.id = "taglist"+parentid
				for (const tag of tagList) {
					const li = document.createElement('li') //有包含情况，退拽不能放li里
					
					const span = document.createElement('span')
					span.draggable = true
					span.id = tag.id
					span.setAttribute( 'ondragstart', 'tag_dragstart(event,this)')
					span.setAttribute( 'ondragover', 'tag_dragover(event,this)')
					span.setAttribute( 'ondragleave', 'tag_dragleave(event,this)')
					span.setAttribute( 'ondrop', 'tag_drop(event,this)')
					span.setAttribute( 'onclick', 'tag_click(event,this)')
					let showtitle = tag.title
					span.innerText = ' '+showtitle+' '

					const detailspan = document.createElement('i')
					detailspan.id = 'tagper'+tag.id
					detailspan.className = 'fas fa-folder-open';
					if (tag.children && tag.children.length > 0) {
						detailspan.setAttribute( 'onclick', 'showdetail("'+tag.id+'",this)')
						// detailspan.innerText = "----"
					}
					// else{
					// 	detailspan.innerText = "----"
					// }
					
					li.appendChild(detailspan)
					li.appendChild(span)

					if (tag.children && tag.children.length > 0) {
						const addbutton = document.createElement("i");
						addbutton.className = `fas fa-tag`;//tags
						addbutton.id = 'addNoteBT'+tag.id
						addbutton.setAttribute( 'onclick', 'addNoteTag("'+tag.id+'",this)')
						li.appendChild(addbutton)

						li.appendChild(renderTagTree(tag.children,tag.id))
					}else if(tag.children && tag.children.length == 0){
						const rmbutton = document.createElement("i");
						rmbutton.className = `fas fa-times`;//remove
						rmbutton.id = 'removeBT'+tag.id
						rmbutton.setAttribute( 'onclick', 'removeTag("'+tag.id+'",this)')
						li.appendChild(rmbutton)

						const addbutton = document.createElement("i");
						addbutton.className = `fas fa-tag`;//tags
						addbutton.id = 'addNoteBT'+tag.id
						addbutton.style.marginLeft = '7px'
						addbutton.setAttribute( 'onclick', 'addNoteTag("'+tag.id+'",this)')
						li.appendChild(addbutton)
					}
					
					ul.appendChild(li)
				}
				return ul
			}

			// render tag tree  fas fa-times；
			// https://fa5.dashgame.com/#/%E5%9B%BE%E6%A0%87
			// far fa-trash-alt；far fa-folder；far fa-folder-open；


			const button = document.createElement("button");
			button.innerHTML = `<i class="fas fa-sync"></i>`;//refrash
			button.id = 'refreshBT'
			button.setAttribute( 'onclick', 'refresh(event,this)')

			const buttonOpenAll = document.createElement("button");
			buttonOpenAll.innerHTML = `<i class="far fa-folder-open"></i>`;//openall
			buttonOpenAll.id = 'openallBT'
			buttonOpenAll.setAttribute( 'onclick', 'openall(event,this)')

			const buttonCloseAll = document.createElement("button");
			buttonCloseAll.innerHTML = `<i class="far fa-folder"></i>`;//closeall
			buttonCloseAll.id = 'closeallBT'
			buttonCloseAll.setAttribute( 'onclick', 'closeall(event,this)')

			const container = document.createElement('div')
			container.id = ''
			container.style.overflow = 'auto'
			container.style.height = '600px'
			container.appendChild(button)
			container.appendChild(document.createTextNode("\u00A0"))
			container.appendChild(buttonOpenAll)
			container.appendChild(document.createTextNode("\u00A0"))
			container.appendChild(buttonCloseAll)
			container.appendChild(renderTagTree(rootTags,''))
			document.body.appendChild(container)
			console.log('111')
			console.log(container.outerHTML)
			// js无法插入 html中，有安全风险，所以才设计了addscript
			// console.log(jsstr)
			await joplin.views.panels.setHtml(panel, container.outerHTML);
			await joplin.views.panels.addScript(panel, 'jquery-3.2.1.min.js');			
			await joplin.views.panels.addScript(panel, 'webview.js');			
			await joplin.views.panels.addScript(panel, 'webview.css');
			await joplin.views.panels.addScript(panel, 'taglist.js');

			await joplin.views.panels.onMessage(panel, async (message: any) => {
				if (message.name === 'tagdrop') {
					console.log('indexts:tagDrap:'+message.id + '-' + message.newParentId)
					joplin.data.put(['tags',message.id],null, { parent_id: message.newParentId }).then(res => {
						console.log('update-tag',res)
						updateTocView()
					})
				//   await joplin.commands.execute('favsAddFolder', message.id, message.targetIdx);
				}else if (message.name === 'tagclick') {
					console.log('indexts:tagClick:'+message.id )
					joplin.commands.execute("openTag", message.id)
				//   await joplin.commands.execute('favsAddNote', message.id, message.targetIdx);
				}else if (message.name === 'refreshTag') {
					console.log('indexts:refreshTag:'+message.id )
					updateTocView();
				}else if (message.name === 'removeTag') {
					await joplin.data.delete(['tags', message.id], null);
					console.log('indexts:removeTag:'+message.id )
					updateTocView();
				}else if(message.name === 'addTag'){
					const noteId = (await joplin.workspace.selectedNote()).id;	
					console.log('indexts:addTag:'+message.id +'--' + noteId)
					await joplin.data.post(['tags', message.id, 'notes'], null, {
						id: noteId
					});
				}
				
			  });
		}

		// await joplin.workspace.onNoteSelectionChange(() => {
		// 	updateTocView();
		// });
		// joplin.workspace.onNoteSelectionChange(({ value }: { value: string[] }) => {
		// 	if (value.length === 1) {
		// 	  this.currentNoteId = value[0];
		// 	}
		//   });
		const that = this
		await joplin.workspace.onNoteSelectionChange(({ value }: { value: string[] }) => { //To change
			updateTocView();
		});

		updateTocView();

	},
});