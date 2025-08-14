export default {
	columnAdd: function(action){
		action.component.delete(true);
	},

	columnDelete: function(action){
		const newColumn = this.table.columnManager._addColumn(
			action.data.definition,
			action.data.before,
			action.data.nextToColumn
		);
		this.table.columnManager._reIndexColumns();
		this.table.columnManager.redraw(true);
		this.table.rowManager.reinitialize();
		this.table.columnManager.rerenderColumns();
		this._rebindColumn(action.component, newColumn);
	},

	columnMove: function(action){
		const to = this.table.columnManager.getColumnByIndex(action.data.fromIndex);
		this.table.columnManager.moveColumnSilent(
			action.component,
			to,
			action.data.fromAfter
		);
		if (action.data.fromIndex < action.data.toIndex) {
			action.data.toIndex++;
		}
		const newColumn = this.table.columnManager.getColumnByField(action.component.definition.field);
		this._rebindColumn(action.component, newColumn);
	},

	columnTitleEdit: function(action){
		action.component.definition.title = action.data.oldTitle;
		action.component._initialize();
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