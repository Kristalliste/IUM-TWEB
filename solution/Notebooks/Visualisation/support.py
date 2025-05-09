import pandas as pd
import numpy as np
from itertools import combinations
from collections import defaultdict

def plot_movies(movies_df):
    df = movies_df.copy()

    # Rimuove righe con valori nulli nella colonna 'date'
    df = df.dropna(subset=['date'])

    # Converte 'date' in datetime, gestisce errori e ottiene l'anno
    df['Year'] = pd.to_datetime(df['date'], errors='coerce').dt.year

    # Elimina righe dove la conversione a datetime è fallita
    df = df.dropna(subset=['Year'])

    # Converte 'Year' in intero
    df['Year'] = df['Year'].astype(int)

    # Calcola il decennio
    df['Decade'] = (df['Year'] // 10) * 10

    # Conta i film per decennio e li ordina
    decade_counts = df['Decade'].value_counts().sort_index()

    return decade_counts

def check_na_or_inf(df, column):
    """
    Controlla se ci sono valori NaN, inf o -inf in una colonna specifica del DataFrame.

    Parametri:
    - df: il DataFrame da analizzare
    - column: il nome della colonna da controllare (stringa)

    Restituisce:
    - Un dizionario con il conteggio di NaN, inf e -inf
    """
    if column not in df.columns:
        raise ValueError(f"La colonna '{column}' non esiste nel DataFrame.")

    col_data = df[column]

    result = {
        'NaN': col_data.isna().sum(),
        'inf': np.isinf(col_data).sum(),
        '-inf': np.isneginf(col_data).sum()
    }

    return result
