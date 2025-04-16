from flask import Flask, render_template

app = Flask(__name__)

# 配置静态文件缓存时间
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # 修改运行配置，使其能在内网访问
    app.run(
        host='0.0.0.0',  # 允许外部访问
        port=5000,       # 指定端口号
        debug=False      # 生产环境关闭调试模式
    ) 