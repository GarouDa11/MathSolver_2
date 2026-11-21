# MathSolver Pro

Two terminals:

    # 1) Backend (Flask + SymPy)          # 2) Frontend (React + Vite)
    cd backend                            cd frontend
    pip install -r requirements.txt       npm install
    python app.py                         npm run dev

Open http://localhost:5173

Add a calculator: add an entry to `frontend/src/modules/core.js` or `calculus.js`.
Add a module: create `modules/yourmodule.js` and register it in `modules/index.js`.
