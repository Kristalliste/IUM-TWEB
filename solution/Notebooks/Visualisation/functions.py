import pandas as pd

def top15_language_trend(movies_df, languages_df):
    languages_movies_df = pd.merge(movies_df[['id','date']], languages_df[['id', 'language']], on='id', how='inner')

    top15_languages = languages_movies_df['language'].value_counts().head(15).index

    filtered_df = languages_movies_df.loc[languages_movies_df['language'].isin(top15_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage

def top14_language_trend(movies_df, languages_df):
    languages_movies_df = pd.merge(movies_df[['id','date']], languages_df[['id', 'language']], on='id', how='inner')

    top15_languages = languages_movies_df['language'].value_counts().head(15).index
    top14_languages = top15_languages[1:]

    filtered_df = languages_movies_df.loc[languages_movies_df['language'].isin(top14_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage