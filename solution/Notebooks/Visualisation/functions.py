import pandas as pd
import matplotlib.pyplot as plt

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

def countries_oscar_merged(movies_df, countries_df, oscar_df):
    countries_movies_df = pd.merge(movies_df[['id', 'name']], countries_df[['id', 'country']], on='id', how='inner')
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(countries_movies_df[['name', 'country']], temp_oscar_df[['film','winner']],
                                   left_on='name', right_on='film')
    return countries_wins_merged_df

def countries_reviews_merged(movies_df, countries_df, reviews_df):
    countries_movies_df = pd.merge(movies_df[['id', 'name']], countries_df[['id', 'country']], on='id', how='inner')
    # Dropping the entries with null `movie_title` or 'review_score' values
    temp_reviews_df = reviews_df.dropna(subset=['movie_title', 'normalized_score'], how='any')

    countries_merged_df = pd.merge(countries_movies_df[['name', 'country']],
                                   temp_reviews_df[['movie_title', 'normalized_score']], left_on='name',
                                   right_on='movie_title')
    return countries_merged_df

def genres_oscar_merged(movies_df, oscar_df, genres_df):
    genres_movies_df = pd.merge(movies_df[['id', 'name']], genres_df[['id', 'genre']], on='id', how='inner')
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'])
    genres_merged_df = pd.merge(genres_movies_df[['name', 'genre']], temp_oscar_df[['film', 'winner']],
                                left_on='name', right_on='film')
    return genres_merged_df

def oscar_reviews_merged(movies_df, oscar_df, reviews_df):
    temp_oscar_df = oscar_df.dropna(subset=['film'])
    reviews_merged_df = pd.merge(reviews_df[['movie_title', 'normalized_score']], temp_oscar_df[['film', 'winner']],
                                left_on='movie_title', right_on='film')
    return reviews_merged_df

#Define the main palette we used in the visualisation file
def color_palette(df):
    cmap = plt.colormaps.get_cmap('viridis')
    colors = [cmap(i / len(df)) for i in range(len(df))]
    return colors