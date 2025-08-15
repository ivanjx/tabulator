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
		let to = this.table.columnManager.getColumnByIndex(action.data.fromIndex);
		let after = false;
		if (!to) {
			to = this.table.columnManager.getColumns().slice(-1)[0];
			after = true;
		}
		this.table.columnManager.moveColumnSilent(
			action.component,
			to,
			after
		);
		const newColumn = this.table.columnManager.getColumnByField(action.component.definition.field);
		this._rebindColumn(action.component, newColumn);
	},

	columnTitleEdit: function(action){
		const column = this.table.columnManager.getColumnByField(action.data.field);
		column.definition.title = action.data.oldTitle;
		while(column.element.firstChild) column.element.removeChild(column.element.firstChild);
		column.contentElement = column._buildColumnHeaderContent();
		column.element.appendChild(column.contentElement);
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