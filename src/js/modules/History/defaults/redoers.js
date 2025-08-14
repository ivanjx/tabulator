export default {
	columnAdd: function(action){
		// Check for previous columnDelete with same field (title change)
		const history = this.history;
		const idx = this.index;
		if (idx > 0) {
			const prev = history[idx - 1];
			if (prev && prev.type === "columnDelete" && prev.data.field === action.data.definition.field) {
				// Redo title change: set to new title
				const col = action.component.table.columnManager.getColumnByField(action.data.definition.field);
				if (col) {
					col.definition.title = action.data.definition.title;
					col._initialize();
				}
				return;
			}
		}
		// Otherwise, redo column add by adding the column again
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.addColumn(action.data.definition);
		}
	},

	columnDelete: function(action){
		// Check for next columnAdd with same field (title change)
		const history = this.history;
		const idx = this.index;
		if (idx < history.length - 1) {
			const next = history[idx + 1];
			if (next && next.type === "columnAdd" && next.data.definition.field === action.data.field) {
				// Redo title change: set to new title
				const col = action.component.table.columnManager.getColumnByField(action.data.field);
				if (col) {
					col.definition.title = next.data.definition.title;
					col._initialize();
				}
				return;
			}
		}
		// Otherwise, redo column delete by removing the column again
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.deleteColumn(action.data.definition.field);
		}
	},

	columnMove: function(action){
		// Redo column move by moving to new position
		if(action.component && action.component.table){
			action.component.table.columnManager.moveColumnActual(action.data.from, action.data.to, action.data.after);
		}
	},
	cellEdit: function(action){
		action.component.setValueProcessData(action.data.newValue);
		action.component.cellRendered();
	},

	rowAdd: function(action){
		var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);

		if(this.table.options.groupBy && this.table.modExists("groupRows")){
			this.table.modules.groupRows.updateGroupRows(true);
		}

		this._rebindRow(action.component, newRow);

		this.table.rowManager.checkPlaceholder();
	},

	rowDelete:function(action){
		action.component.deleteActual();

		this.table.rowManager.checkPlaceholder();
	},

	rowMove: function(action){
		this.table.rowManager.moveRowActual(action.component, this.table.rowManager.getRowFromPosition(action.data.posTo), action.data.after);
		
		this.table.rowManager.regenerateRowPositions();
		this.table.rowManager.reRenderInPosition();
	},
};