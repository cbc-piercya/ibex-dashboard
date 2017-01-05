import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const columns = [
            {   editable: false, 
                key: "RowKey", 
                name: "Page ID",
                resizable: false
            },
            {
                editable:true,
                sortable : true,
                filterable: true,
                required: true,
                compositeKey: true, 
                resizable: true,
                name: "Facebook Page ID",
                key: "pageUrl"
            }
];

export const FacebookPagesEditor = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    getInitialState(){
        return {
        };
    },
    componentDidMount(){
        this.getFlux().actions.ADMIN.load_fb_pages(this.props.siteKey);
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleSave(mutatedRows, columns){
        this.getFlux().actions.ADMIN.save_fb_pages(this.props.siteKey, mutatedRows);
    },
    handleRemove(deletedRows){
        const reducedRows = deletedRows.map(page=>Object.assign({}, {RowKey: page.RowKey}));
        this.getFlux().actions.ADMIN.remove_fb_pages(this.props.siteKey, reducedRows);
    },
    render(){
        let state = this.getFlux().store("AdminStore").getState();

        return (
         this.state.locations.length > 0 ? 
            <DataGrid rowHeight={40}
                      minHeight={500}
                      rowKey="RowKey"
                      guidAutofillColumn="RowKey"
                      handleSave={this.handleSave}
                      handleRemove={this.handleRemove}
                      columns={columns}
                      rows={state.facebookPages} />
            : <div />
        );
    }
});