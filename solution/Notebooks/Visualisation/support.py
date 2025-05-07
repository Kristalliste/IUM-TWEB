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

def normalization(reviews_df):
    letter_scores = {
        'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5, 'C-': 4.5, 'D+': 4, 'D': 3, 'D-': 2.5,
        'F': 1
    }

    # Initialize normalized_score column
    reviews_df['normalized_score'] = np.nan

    # --- FRACTION FORMAT ---
    mask_fraction = reviews_df['review_score'].str.contains('/', na=False)
    split_scores = reviews_df.loc[mask_fraction, 'review_score'].str.extract(r'(\d+(?:\.\d+)?)/(\d+(?:\.\d+)?)').astype(
        float)

    # Exclude zero denominators to avoid division by zero
    valid_denominator = split_scores[1] != 0
    valid_indices = split_scores[valid_denominator].index
    # Normalize valid fractions to a 0–10 scale
    normalized_values = (split_scores.loc[valid_denominator, 0] / split_scores.loc[valid_denominator, 1]) * 10
    reviews_df.loc[valid_indices, 'normalized_score'] = normalized_values
    # Create a mask for entries that contain 'x/0' or 'xx/00'
    mask_invalid_denominators = reviews_df['review_score'].str.contains(r'/0$', na=False)
    # Modify entries with invalid denominators
    reviews_df.loc[mask_invalid_denominators, 'review_score'] = reviews_df.loc[
        mask_invalid_denominators, 'review_score'].apply(
        lambda score: f"{float(score.split('/')[0]) / 10}/10" if '/' in score else score)

    # --- LETTER FORMAT ---
    mask_letter = ~mask_fraction & reviews_df['review_score'].str.contains(r'[A-F]', na=False)
    cleaned_letters = reviews_df.loc[mask_letter, 'review_score'].str.upper().str.replace(r'\s+', '', regex=True)
    reviews_df.loc[mask_letter, 'normalized_score'] = cleaned_letters.map(letter_scores)

    # --- RAW NUMERIC FORMAT ---
    mask_numeric = ~mask_fraction & reviews_df['review_score'].str.match(r'^\d+(\.\d+)?$', na=False)
    numeric_scores = reviews_df.loc[mask_numeric, 'review_score'].astype(float)
    # Heuristic: if the score is ≤10, treat as out of 10; else, treat as out of 100
    normalized_numeric = numeric_scores.apply(lambda x: x if x <= 10 else (x / 100) * 10)
    reviews_df.loc[mask_numeric, 'normalized_score'] = normalized_numeric

    # --- NOMINATOR AND DENOMINATOR ON DIFFERENT SCALES ---
    # Extract numerator and denominator as floats
    fraction_parts = reviews_df.loc[mask_fraction, 'review_score'].str.extract(
        r'(\d+(?:\.\d+)?)/(\d+(?:\.\d+)?)').astype(float)
    numerators = fraction_parts[0]
    denominators = fraction_parts[1]

    # Create a mask: numerator <= 10 AND denominator is 4 or 5
    fix_scale_mask = (numerators <= 10) & (denominators.isin([4.0, 5.0]))

    # Indexes where the fix applies
    fix_indices = numerators[fix_scale_mask].index

    # Replace original review_score strings at those indices with 'numerator/10'
    reviews_df.loc[fix_indices, 'review_score'] = numerators[fix_indices].astype(str) + '/10'

    reviews_df = reviews_df[reviews_df['normalized_score'].between(0, 10)]
    return reviews_df