import { createHttpEffect } from '@servicenow/ui-effect-http';
import { createCustomElement, actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;

import styles from './styles.scss';

import { columns, taskTables } from './defaults.js';
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
        'FETCH_TASK_DATA': createHttpEffect('api/now/table/task', {
            method: 'GET',
            queryParams: [
                'sysparm_fields',
                'sysparm_query',
                'sysparm_display_value',
                'sysparm_exclude_reference_link'
            ],
            successActionType: 'FETCH_TASK_DATA_SUCCEEDED'
        }),
        [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
            const { dispatch } = coeffects;

            const query = `sys_class_nameIN${taskTables.join(',')}`;

            const fields = columns.map((col) => {
                return col.field;
            }).join(',');

            dispatch('FETCH_TASK_DATA', {
                sysparm_query: query,
                sysparm_display_value: 'all',
                sysparm_exclude_reference_link: true,
                sysparm_fields: fields
            });
        },
        'FETCH_TASK_DATA_SUCCEEDED': (coeffects) => {
            const { action, updateState } = coeffects;
            const { result } = action.payload;

            const dataRows = result.map((row) => {
                return Object.keys(row).reduce((acc, val) => {
                    if (val === 'sys_class_name') {
                        acc[val] = row[val].value;
                    } else {
                        acc[val] = row[val].display_value;
                    }

                    return acc;
                }, {});
            });

            updateState({ dataRows });
        }
    },
    styles
});