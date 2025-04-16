from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

if __name__ == '__main__':
    # 生成静态文件
    freezer.freeze() 