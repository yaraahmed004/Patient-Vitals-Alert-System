import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV
from app.utils import load_process_data
from sklearn.ensemble import IsolationForest
import joblib


x_train, x_test, y_train, y_test = load_process_data("C:\\Users\\hp\\Desktop\\ACP_project\\patient readings dataset.csv")

iso_model = IsolationForest(
    n_estimators=100,
    max_samples='auto', 
    contamination=0.05,
    random_state=42
)

iso_model.fit(x_train)
joblib.dump(iso_model, 'models/isolation_forest_model.pkl')

y_anomaly= iso_model.predict(x_test)

x_test['anomaly'] = y_anomaly

print("Normal readings:", (y_anomaly == 1).sum())
print("Anomalies detected:", (y_anomaly == -1).sum())

plt.figure(figsize=(10,6))
sns.scatterplot(
    x=x_test['heartbeat'], 
    y=x_test['spo2'], 
    hue=x_test['anomaly'],
    palette={1:'green', -1:'red'}
)
plt.title('Isolation Forest - Anomaly Detection')
plt.show()

