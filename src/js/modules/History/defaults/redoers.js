export default {
	columnAdd: function(action){
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.addColumn(action.data.definition);
		}
	},

	columnDelete: function(action){
		if(action.component && action.component.table && action.data.definition){
			action.component.table.columnManager.deleteColumn(action.data.definition.field);
		}
	},

	columnMove: function(action){
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