import { createCustomElement} from '@servicenow/ui-core';
import { actionHandlers } from './actionHandlers';

import styles from './styles.scss';

import { columns } from './defaults.js';
import '../components/now-experience-table';

createCustomElement('snc-now-experience-dashboard', {
    view: function(state, helpers) {
        const { dataRows } = state;

        const displayColumns = columns.filter((col) => {
            return col.field !== 'sys_id';
        });

        return (
            <div className="container">
                <div className="table-content">
                    <now-experience-table
                        title="Task table"
                        dataColumns={displayColumns}
                        dataRows={dataRows}
                    ></now-experience-table>
                </div>
            </div>
        );
    },
    actionHandlers: {
        ...actionHandlers
    },
    styles
});