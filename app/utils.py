import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import IsolationForest
import matplotlib.pyplot as plt
import seaborn as sns

def load_process_data(path):

    data = pd.read_csv('venv\patient readings dataset.csv')

    data.info()

    data.isnull().sum()

    data = data.drop(columns=['patient_id'])
    data = data.dropna()

    if data["timestamp"].dtype == "object":
        data["timestamp"] = (
            pd.to_timedelta("00:" + data["timestamp"])
            .dt.total_seconds()
        )

    x = data.drop('status', axis=1)
    y = data['status']

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    train_data = x_train.join(y_train)

    train_data.corr()

    # engineered feature
    x_train['oxygen_stress'] = (x_train['heartbeat'] + x_train['respiratory_rate']) / x_train['spo2']
    x_test['oxygen_stress'] = (x_test['heartbeat'] + x_test['respiratory_rate']) / x_test['spo2']


    plt.figure(figsize=(15,8))
    sns.heatmap(train_data.corr(), annot=True, cmap="YlGnBu")

    return x_train, x_test, y_train, y_test
