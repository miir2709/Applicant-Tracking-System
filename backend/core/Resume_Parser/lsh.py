import numpy as np
from datasketch import MinHash, MinHashLSHForest
import re

from validators import Min 

def preprocess(text):
    text = re.sub(r'[^\w\s]', '', text)
    tokens = text.lower()
    tokens = list(set(tokens.split()))
    return tokens

def get_forest(data, perms=128):
    minhash = []
    for text in data['skills']:
        tokens = preprocess(text)
        m = MinHash(num_perm=perms)
        for s in tokens:
            m.update(s.encode('utf8'))
        minhash.append(m)
    forest = MinHashLSHForest(num_perm=perms)
    for i, m in enumerate(minhash):
        forest.add(i, m)
    forest.index()
    return forest

def predict(text, database, perms, num_results, forest):
    tokens = preprocess(text)
    m = MinHash(num_perm=perms)
    for s in tokens:
        m.update(s.encode('utf8'))
    idx_array = np.array(forest.query(m, num_results))
    if len(idx_array) == 0:
        return None
    result = database.iloc[idx_array][['Filename', 'Skills']]
    return result


