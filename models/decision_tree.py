from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from app.utils import load_process_data
import joblib


x_train, x_test, y_train, y_test = load_process_data("C:\\Users\\hp\\Desktop\\ACP_project\\patient readings dataset.csv")

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('dt', DecisionTreeClassifier(random_state=42))
])

dt_param_grid = {
    'dt__max_depth': [None, 5, 10, 20],
    'dt__min_samples_split': [2, 5, 10],
    'dt__min_samples_leaf': [1, 2, 4],
    'dt__criterion': ['gini', 'entropy']
}

dt_grid = GridSearchCV(
    pipeline,
    dt_param_grid,
    cv=3,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)

dt_grid.fit(x_train, y_train)
joblib.dump(dt_grid.best_estimator_, 'models/decision_tree_model.pkl')

y_pred_dt = dt_grid.predict(x_test)

print("Decision Tree best params:", dt_grid.best_params_)
print("Decision Tree accuracy:", accuracy_score(y_test, y_pred_dt))
print("Decision Tree classification report:\n", classification_report(y_test, y_pred_dt))
print("Decision Tree confusion matrix:\n", confusion_matrix(y_test, y_pred_dt))
