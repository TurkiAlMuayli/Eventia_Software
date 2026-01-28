attendee: `
            <div class="form-row" style="display: flex; gap: 10px;">
                <div class="input-group" style="flex: 1;">
                    <label>First Name</label>
                    <input type="text" name="first_name" placeholder="First Name" required>
                </div>
                <div class="input-group" style="flex: 1;">
                    <label>Last Name</label>
                    <input type="text" name="last_name" placeholder="Last Name" required>
                </div>
            </div>
            
            ```

### **Summary of Changes Required:**
1.  **Backend:** Replace `forms.py` with the code above.
2.  **Frontend:** Update `app.js` to add `name="first_name"` and `name="last_name"` to the inputs.
3.  **Deploy:** Run `python manage.py collectstatic --noinput` (to update JS) and `python manage.py migrate` (if you haven't already migrated the gender changes).