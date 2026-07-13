# Workspace Rules for AgroGestão ERP

1. **NO AUTOMATIC DEPLOYMENTS**:
   NEVER run `git push` automatically after changing the code.
   The user has explicitly requested to manually control updates.
   
2. **LOCAL TESTING FIRST**:
   Before updating, ensure the user can test the code locally. Since it's a React Vite application, explain to the user that they can test by running `npm run dev` and accessing `http://localhost:5173`. Avoid trying to generate a single `.html` file because the Vite build outputs modular JS assets.

3. **MANUAL UPLOAD COMMANDS**:
   After the user finishes testing and approves the changes, always provide the exact Git commands for them to execute manually to push the updates to Vercel:
   ```bash
   git add .
   git commit -m "sua mensagem"
   git push
   ```
