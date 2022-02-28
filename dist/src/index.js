// Vue API
import { reactive } from 'vue';
// Helpers
import { logError, isAsyncFunction, hasAsyncLogic } from './helpers';
// createSore can be called to create
// a store template based on the given
// options, which include initial state,
// mutations and actions
export const createStore = (options) => {
    // create reactive state root
    const state = reactive(options.state);
    // commit a mutation to the present state
    const commit = (type, payload) => {
        // get the mutation
        const fn = options.mutations?.[type];
        // if the mutation is an async function
        // output the error message to the console
        if (isAsyncFunction(fn)) {
            return logError('ERROR[store]: mutation can only be a synchronous function');
        }
        // if the mutation involves asynchronous logic
        // output the error message to the console
        if (hasAsyncLogic(fn)) {
            return logError('ERROR[store]: asynchronous logic, including timers ' +
                'and promises, cannot be used in mutations');
        }
        // if the mutation exist run the mutation
        if (fn)
            return fn(state, payload);
        // If the type doesn't exist in mutations
        // output the error message to the console
        logError('unknown mutation type');
    };
    // dispatch a action for synchronous or asynchronous tasks
    const dispatch = (type, payload) => {
        // get the action
        const fn = options.actions?.[type];
        // if action exists run the action
        if (fn)
            return fn({ commit, dispatch }, payload);
        // If the type doesn't exist in actions
        // output the warning message to the console
        logError('unknown action type');
    };
    return {
        state,
        commit,
        dispatch,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsVUFBVTtBQUNWLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDOUIsVUFBVTtBQUNWLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUlwRSxxQ0FBcUM7QUFDckMsc0NBQXNDO0FBQ3RDLHdDQUF3QztBQUN4Qyx3QkFBd0I7QUFDeEIsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQ3pCLE9BQXlCLEVBQ2QsRUFBRTtJQUNiLDZCQUE2QjtJQUM3QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQXNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxRCx5Q0FBeUM7SUFDekMsTUFBTSxNQUFNLEdBQUcsQ0FBaUMsSUFBTyxFQUFFLE9BQVksRUFBRSxFQUFFO1FBQ3ZFLG1CQUFtQjtRQUNuQixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBYyxDQUFDLENBQUE7UUFDOUMsdUNBQXVDO1FBQ3ZDLDBDQUEwQztRQUMxQyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN2QixPQUFPLFFBQVEsQ0FDYiwyREFBMkQsQ0FDNUQsQ0FBQTtTQUNGO1FBQ0QsOENBQThDO1FBQzlDLDBDQUEwQztRQUMxQyxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNyQixPQUFPLFFBQVEsQ0FDYixxREFBcUQ7Z0JBQ3JELDJDQUEyQyxDQUM1QyxDQUFBO1NBQ0Y7UUFDRCx5Q0FBeUM7UUFDekMsSUFBSSxFQUFFO1lBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2pDLHlDQUF5QztRQUN6QywwQ0FBMEM7UUFDMUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFDbkMsQ0FBQyxDQUFBO0lBQ0QsMERBQTBEO0lBQzFELE1BQU0sUUFBUSxHQUFHLENBQStCLElBQU8sRUFBRSxPQUFhLEVBQUUsRUFBRTtRQUN4RSxpQkFBaUI7UUFDakIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQWMsQ0FBQyxDQUFBO1FBQzVDLGtDQUFrQztRQUNsQyxJQUFJLEVBQUU7WUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNoRCx1Q0FBdUM7UUFDdkMsNENBQTRDO1FBQzVDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBQ2pDLENBQUMsQ0FBQTtJQUVELE9BQU87UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLFFBQVE7S0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVnVlIEFQSVxuaW1wb3J0IHsgcmVhY3RpdmUgfSBmcm9tICd2dWUnXG4vLyBIZWxwZXJzXG5pbXBvcnQgeyBsb2dFcnJvciwgaXNBc3luY0Z1bmN0aW9uLCBoYXNBc3luY0xvZ2ljIH0gZnJvbSAnLi9oZWxwZXJzJ1xuLy8gVHlwZXNcbmltcG9ydCB7IElTdG9yZSwgSVN0b3JlT3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnXG5cbi8vIGNyZWF0ZVNvcmUgY2FuIGJlIGNhbGxlZCB0byBjcmVhdGVcbi8vIGEgc3RvcmUgdGVtcGxhdGUgYmFzZWQgb24gdGhlIGdpdmVuXG4vLyBvcHRpb25zLCB3aGljaCBpbmNsdWRlIGluaXRpYWwgc3RhdGUsXG4vLyBtdXRhdGlvbnMgYW5kIGFjdGlvbnNcbmV4cG9ydCBjb25zdCBjcmVhdGVTdG9yZSA9IDxTIGV4dGVuZHMgSVN0b3JlT3B0aW9uczxTPj4oXG4gIG9wdGlvbnM6IElTdG9yZU9wdGlvbnM8Uz5cbik6IElTdG9yZTxTPiA9PiB7XG4gIC8vIGNyZWF0ZSByZWFjdGl2ZSBzdGF0ZSByb290XG4gIGNvbnN0IHN0YXRlID0gcmVhY3RpdmU8U1snc3RhdGUnXSAmIG9iamVjdD4ob3B0aW9ucy5zdGF0ZSlcbiAgLy8gY29tbWl0IGEgbXV0YXRpb24gdG8gdGhlIHByZXNlbnQgc3RhdGVcbiAgY29uc3QgY29tbWl0ID0gPEsgZXh0ZW5kcyBrZXlvZiBTWydtdXRhdGlvbnMnXT4odHlwZTogSywgcGF5bG9hZDogYW55KSA9PiB7XG4gICAgLy8gZ2V0IHRoZSBtdXRhdGlvblxuICAgIGNvbnN0IGZuID0gb3B0aW9ucy5tdXRhdGlvbnM/Llt0eXBlIGFzIHN0cmluZ11cbiAgICAvLyBpZiB0aGUgbXV0YXRpb24gaXMgYW4gYXN5bmMgZnVuY3Rpb25cbiAgICAvLyBvdXRwdXQgdGhlIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGNvbnNvbGVcbiAgICBpZiAoaXNBc3luY0Z1bmN0aW9uKGZuKSkge1xuICAgICAgcmV0dXJuIGxvZ0Vycm9yKFxuICAgICAgICAnRVJST1Jbc3RvcmVdOiBtdXRhdGlvbiBjYW4gb25seSBiZSBhIHN5bmNocm9ub3VzIGZ1bmN0aW9uJ1xuICAgICAgKVxuICAgIH1cbiAgICAvLyBpZiB0aGUgbXV0YXRpb24gaW52b2x2ZXMgYXN5bmNocm9ub3VzIGxvZ2ljXG4gICAgLy8gb3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlIHRvIHRoZSBjb25zb2xlXG4gICAgaWYgKGhhc0FzeW5jTG9naWMoZm4pKSB7XG4gICAgICByZXR1cm4gbG9nRXJyb3IoXG4gICAgICAgICdFUlJPUltzdG9yZV06IGFzeW5jaHJvbm91cyBsb2dpYywgaW5jbHVkaW5nIHRpbWVycyAnICtcbiAgICAgICAgJ2FuZCBwcm9taXNlcywgY2Fubm90IGJlIHVzZWQgaW4gbXV0YXRpb25zJ1xuICAgICAgKVxuICAgIH1cbiAgICAvLyBpZiB0aGUgbXV0YXRpb24gZXhpc3QgcnVuIHRoZSBtdXRhdGlvblxuICAgIGlmIChmbikgcmV0dXJuIGZuKHN0YXRlLCBwYXlsb2FkKVxuICAgIC8vIElmIHRoZSB0eXBlIGRvZXNuJ3QgZXhpc3QgaW4gbXV0YXRpb25zXG4gICAgLy8gb3V0cHV0IHRoZSBlcnJvciBtZXNzYWdlIHRvIHRoZSBjb25zb2xlXG4gICAgbG9nRXJyb3IoJ3Vua25vd24gbXV0YXRpb24gdHlwZScpXG4gIH1cbiAgLy8gZGlzcGF0Y2ggYSBhY3Rpb24gZm9yIHN5bmNocm9ub3VzIG9yIGFzeW5jaHJvbm91cyB0YXNrc1xuICBjb25zdCBkaXNwYXRjaCA9IDxLIGV4dGVuZHMga2V5b2YgU1snYWN0aW9ucyddPih0eXBlOiBLLCBwYXlsb2FkPzogYW55KSA9PiB7XG4gICAgLy8gZ2V0IHRoZSBhY3Rpb25cbiAgICBjb25zdCBmbiA9IG9wdGlvbnMuYWN0aW9ucz8uW3R5cGUgYXMgc3RyaW5nXVxuICAgIC8vIGlmIGFjdGlvbiBleGlzdHMgcnVuIHRoZSBhY3Rpb25cbiAgICBpZiAoZm4pIHJldHVybiBmbih7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcGF5bG9hZClcbiAgICAvLyBJZiB0aGUgdHlwZSBkb2Vzbid0IGV4aXN0IGluIGFjdGlvbnNcbiAgICAvLyBvdXRwdXQgdGhlIHdhcm5pbmcgbWVzc2FnZSB0byB0aGUgY29uc29sZVxuICAgIGxvZ0Vycm9yKCd1bmtub3duIGFjdGlvbiB0eXBlJylcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhdGUsXG4gICAgY29tbWl0LFxuICAgIGRpc3BhdGNoLFxuICB9XG59XG4iXX0=