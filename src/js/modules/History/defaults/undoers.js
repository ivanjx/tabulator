export default {
	columnAdd: function(action){
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.deleteColumn(action.data.definition.field);
		}
	},

	columnDelete: function(action){
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.addColumn(action.data.definition);
		}
	},

	columnMove: function(action){
		if(action.component && action.component.table){
			action.component.table.columnManager.moveColumnActual(action.data.from, action.data.to, !action.data.after);
		}
	},
	
	cellEdit: function(action){
		action.component.setValueProcessData(action.data.oldValue);
		action.component.cellRendered();
	},

	columnTitleEdit: function(action){
		// Update the definition directly
		action.component.definition.title = action.data.oldTitle;
		
		// Trigger a re-initialization to update the display
		action.component._initialize();
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