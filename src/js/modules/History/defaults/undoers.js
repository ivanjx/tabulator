export default {
	columnAdd: function(action){
		// Check for previous columnDelete with same field (title change)
		const history = this.history;
		const idx = this.index;
		if (idx > 0) {
			const prev = history[idx - 1];
			if (prev && prev.type === "columnDelete" && prev.data.field === action.data.definition.field) {
				// Undo title change: revert to previous title
				const col = action.component.table.columnManager.getColumnByField(action.data.definition.field);
				if (col) {
					col.definition.title = prev.data.definition.title;
					col._initialize();
				}
				return;
			}
		}
		// Otherwise, undo column add by removing the column
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.deleteColumn(action.data.definition.field);
		}
	},

	columnDelete: function(action){
		// Check for next columnAdd with same field (title change)
		const history = this.history;
		const idx = this.index;
		if (idx < history.length - 1) {
			const next = history[idx + 1];
			if (next && next.type === "columnAdd" && next.data.definition.field === action.data.field) {
				// Undo title change: revert to previous title
				const col = action.component.table.columnManager.getColumnByField(action.data.field);
				if (col) {
					col.definition.title = action.data.definition.title;
					col._initialize();
				}
				return;
			}
		}
		// Otherwise, undo column delete by re-adding the column
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.addColumn(action.data.definition);
		}
	},

	columnMove: function(action){
		// Undo column move by moving back to original position
		if(action.component && action.component.table){
			action.component.table.columnManager.moveColumnActual(action.data.from, action.data.to, !action.data.after);
		}
	},
	cellEdit: function(action){
		action.component.setValueProcessData(action.data.oldValue);
		action.component.cellRendered();
	},

	rowAdd: function(action){
		action.component.deleteActual();

		this.table.rowManager.checkPlaceholder();
	},

	rowDelete: function(action){
		var newRow = this.table.rowManager.addRowActual(action.data.data, action.data.pos, action.data.index);

		if(this.table.options.groupBy && this.table.modExists("groupRows")){
			this.table.modules.groupRows.updateGroupRows(true);
		}

		this._rebindRow(action.component, newRow);

		this.table.rowManager.checkPlaceholder();
	},

	rowMove: function(action){
		var after = (action.data.posFrom  - action.data.posTo) > 0;

		this.table.rowManager.moveRowActual(action.component, this.table.rowManager.getRowFromPosition(action.data.posFrom), after);

		this.table.rowManager.regenerateRowPositions();
		this.table.rowManager.reRenderInPosition();
	},
};